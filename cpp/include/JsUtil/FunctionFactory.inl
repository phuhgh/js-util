#pragma once

namespace Autogen
{

namespace Impl
{

/**
 * @returns A mapping of pipeline step to offset in the function array.
 */
template <typename... TPipelineSteps>
constexpr auto getFunctionOffsets(std::tuple<TPipelineSteps...> const& pipelineStages)
{
    auto stageSizes =
        TupleExt::map(pipelineStages, []<typename TStage>(TStage const&) { return std::tuple_size_v<TStage>; });

    return TupleExt::map(pipelineStages, [&stageSizes]<typename TStage>(TStage stage) {
        constexpr auto stageIndex = TupleExt::IndexOf<TStage, decltype(pipelineStages)>::value;

        auto offset = stageIndex + 1 < sizeof...(TPipelineSteps)
                          ? TupleExt::reduce(
                                std::get<1>(TupleExt::splitAt<stageIndex + 1>(stageSizes)),
                                [](auto totalOffset, auto size) { return totalOffset + (size > 1 ? size : 0); },
                                0
                            )
                          : 1;

        return TupleExt::map(stage, [offset]<typename TStep>(TStep) {
            constexpr auto stepIndex = TupleExt::IndexOf<TStep, decltype(stage)>::value;
            return stepIndex * offset;
        });
    });
}

auto getCategoryFromStage(auto const& stage)
{
    auto const& firstStep = std::get<0>(stage);
    using TFirstStep = std::decay_t<decltype(firstStep)>;
    auto const& specialization = Impl::SpecializationMatcher<TFirstStep>::getSpecialization(firstStep);
    return *specialization.category;
}

} // namespace Impl

template <unsigned BlockSize>
template <typename TContext, typename TArg, typename TFunction>
constexpr auto ForEachConnector<BlockSize>::createOne(TFunction callback) const
{
    return [callback, _opts = options](TContext&& context, TArg items) {
        using TIndex = typename TArg::size_type;

        auto stride = static_cast<TIndex>(_opts.stride);
        auto offset = static_cast<TIndex>(_opts.offset);
        auto end = std::min(static_cast<TIndex>(_opts.end), items.size());

        static_assert(
            // (-1 as the function must take context as a parameter too)
            LangExt::FunctionTraits<TFunction>::arity - 1 == BlockSize,
            "callback doesn't have the correct number of parameters (it must match the window size + context)"
        );

        for (TIndex i = offset; i < end; i += stride)
        {
            [&]<std::size_t... Is>(std::index_sequence<Is...>) {
                callback(std::forward<TContext>(context), items[i + Is]...);
            }(std::make_index_sequence<BlockSize>());
        }
    };
}

template <typename TContext, typename TArg, typename TStep>
constexpr auto SegmentedDataViewConnector::createOne(TStep callback) const
{
    return [callback](TContext&& context, TArg items) {
        for (typename TArg::size_type i = 0, length = items.getLength(); i < length; ++i)
        {
            callback(std::forward<TContext>(context), items.getBlock(i));
        }
    };
}

template <unsigned BlockSize>
constexpr auto const& Impl::SpecializationMatcher<
    ForEachConnector<BlockSize>>::getSpecialization(ForEachConnector<BlockSize> const&)
{
    if constexpr (BlockSize == 1)
    {
        return scFOR_EACH_1;
    }
    else if (BlockSize == 2)
    {
        return scFOR_EACH_2;
    }
    else if (BlockSize == 3)
    {
        return scFOR_EACH_3;
    }
    else
    {
        static_assert(false, "unsupported block size");
        // just to shut up warning about not all code paths returning, totally pointless...
        return scFOR_EACH_1;
    }
}

template <unsigned BlockSize>
template <typename TFactory, typename TPrevStep>
constexpr auto Impl::PipelineExtensions<ForEachConnector<BlockSize>>::apply(
    TFactory                           factory,
    ForEachConnector<BlockSize> const& step,
    TPrevStep
)
{
    using TContext = typename TFactory::TContext;
    using TFTraits = LangExt::FunctionTraits<typename TPrevStep::TFunction>;
    // the step before must be a regular function
    static_assert(TFTraits::arity == 2);
    using TArg = typename TFTraits::TRet;

    // step is itself a factory, which takes a callback to create the chainable
    return FunctionFactory(step.template createOne<TContext, TArg>(factory.m_callback));
}

template <typename TFactory, typename TPrevStep>
constexpr auto Impl::PipelineExtensions<SegmentedDataViewConnector>::apply(
    TFactory const&                   factory,
    SegmentedDataViewConnector const& step,
    TPrevStep
)
{
    using TContext = typename TFactory::TContext;
    using TFTraits = LangExt::FunctionTraits<typename TPrevStep::TFunction>;
    // the step before must be a regular function
    static_assert(TFTraits::arity == 2);
    using TArg = typename TFTraits::TRet;

    // step is itself a factory, which takes a callback to create the chainable
    return FunctionFactory(step.template createOne<TContext, TArg>(factory.m_callback));
}

template <typename... TPipelineSteps>
consteval auto applyFunctionFactory(std::tuple<TPipelineSteps...> const& pipelineSteps)
{
    return TupleExt::map(pipelineSteps, [](auto specs) {
        auto reversedSpecs = TupleExt::reverse(specs);
        auto lastStep = std::get<0>(reversedSpecs);
        auto rest = TupleExt::tail(reversedSpecs);

        return TupleExt::reduce(
            rest,
            [&specs](auto factory, auto step) {
                constexpr auto Index = TupleExt::IndexOf<decltype(step), decltype(specs)>::value;
                if constexpr (Index > 0)
                {
                    auto nextStep = std::get<Index - 1>(specs);
                    // we're going backwards, so it's next, but in logical order this is the step before...
                    return Impl::PipelineExtensions<decltype(step)>::apply(std::move(factory), step, nextStep);
                }
                else
                {
                    return Impl::PipelineExtensions<decltype(step)>::apply(std::move(factory), step);
                }
            },
            Impl::PipelineExtensions<decltype(lastStep)>::apply(lastStep)
        );
    });
}

template <typename... TPipelineSteps>
auto getRequiredCategories(std::tuple<TPipelineSteps...> pipelineStages)
{
    constexpr auto totalRequiredCategories = TupleExt::reduce(
        pipelineStages,
        []<typename TStage>(auto total, TStage const&) { return total + (std::tuple_size_v<TStage> > 1 ? 1 : 0); },
        0
    );
    std::array<uint32_t, totalRequiredCategories> requiredCategoryIds{};
    size_t                                        insertionIndex{0};

    TupleExt::forEach(pipelineStages, [&requiredCategoryIds, &insertionIndex]<typename TStage>(TStage const& stage) {
        if constexpr (std::tuple_size_v<TStage> > 1)
        {
            auto const& firstCategory = Impl::getCategoryFromStage(stage);
            using TFirstCategory = decltype(firstCategory);
            requiredCategoryIds[insertionIndex++] = JsUtil::getCategoryId(firstCategory);

            // ensure consistency of the stage
            auto rest = TupleExt::tail(stage);
            TupleExt::forEach(rest, [](auto step) {
                using TOtherStep = std::decay_t<decltype(step)>;
                auto const& otherSpecialization = Impl::SpecializationMatcher<TOtherStep>::getSpecialization(step);
                using TOtherCategory = decltype(*otherSpecialization.category);
                static_assert(std::is_same_v<TFirstCategory, TOtherCategory>, "inconsistent categories in stage");
            });
        }
    });

    return requiredCategoryIds;
}

template <typename... TPipelineSteps>
auto createFunctionMapping(std::tuple<TPipelineSteps...> pipelineStages)
{
    auto           offsets = Impl::getFunctionOffsets(pipelineStages);
    constexpr auto categoryCount =
        TupleExt::reduce(pipelineStages, [](auto total, auto const&) { return total + 1; }, 0);
    constexpr auto maxStageSize = TupleExt::reduce(
        pipelineStages,
        []<typename TStage>(auto total, TStage const&) {
            constexpr auto size = std::tuple_size_v<TStage>;
            return size > total ? size : total;
        },
        0ul
    );
    constexpr auto specializationMapSize = JsUtil::nextPrime(maxStageSize * 15ul / 10ul);
    constexpr auto categoryMapSize = JsUtil::nextPrime(categoryCount * 15ul / 10ul);

    using TSpecializationMap = JsUtil::FixedHashMap<uint32_t, uint32_t, specializationMapSize>;
    JsUtil::FixedHashMap<uint32_t, TSpecializationMap, categoryMapSize> categoryMap{};

    TupleExt::forEach(pipelineStages, [&categoryMap, &offsets]<typename TStage>(TStage const& stage) {
        constexpr auto stageIndex = TupleExt::IndexOf<TStage, decltype(pipelineStages)>::value;
        auto           catKey = JsUtil::getCategoryId(Impl::getCategoryFromStage(stage));
        auto*          specializationMap = categoryMap.insert(catKey, TSpecializationMap{});

        if (specializationMap == nullptr)
        {
            JsUtil::Debug::error("expected to insert category, but the insertion failed...");
            return;
        }

        TupleExt::forEach(stage, [&specializationMap, &offsets]<typename TStep>(TStep const& step) {
            constexpr auto stepIndex = TupleExt::IndexOf<TStep, decltype(stage)>::value;
            auto           offset = std::get<stepIndex>(std::get<stageIndex>(offsets));

            auto const& specialization = Impl::SpecializationMatcher<TStep>::getSpecialization(step);
            auto        specializationId = JsUtil::getSpecializationId(specialization);
            auto*       insertedSpecialization = specializationMap->insert(specializationId, offset);

            if (insertedSpecialization == nullptr)
            {
                JsUtil::Debug::error("failed to insert specialization");
            }
        });
    });

    return categoryMap;
}

} // namespace Autogen
