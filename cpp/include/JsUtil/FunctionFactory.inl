#pragma once

namespace Autogen
{

namespace Impl
{

constexpr auto getCategoryFromStage(auto const& stage)
{
    auto const& firstStep = std::get<0>(stage);
    using TFirstStep = std::decay_t<decltype(firstStep)>;
    auto const& specialization = SpecializationMatcher<TFirstStep>::getSpecialization(firstStep);
    return *specialization.category;
}

template <typename TCallback>
template <typename TFactory, typename TPrevStep>
constexpr auto PipelineExtensions<IteratorConnector<TCallback>>::apply(
    TFactory const&                     factory,
    IteratorConnector<TCallback> const& step,
    TPrevStep
)
{
    using TContext = typename TFactory::TContext;
    using TFTraits = LangExt::FunctionTraits<typename TPrevStep::TFunction>;
    // the step before must be a regular function
    static_assert(TFTraits::arity == 2);
    using TArg = typename TFTraits::TRet;

    // step is itself a factory, which takes a callback to create the chainable
    return createFunctionFactory(step.template createOne<TContext, TArg>(factory.m_callback));
}

} // namespace Impl

template <typename TPFn, typename TPArg, typename TPContext, typename TPRet>
template <typename TExtFn>
constexpr auto FunctionFactory<TPFn, TPArg, TPContext, TPRet>::extend(TExtFn const& callback) const
{
    using TExtFnTraits = LangExt::FunctionTraits<TExtFn>;
    using TExtFnRet = typename TExtFnTraits::TRet;

    auto wrapper = [other = m_callback, callback](TContext context, TArg arg) {
        return callback(context, other(context, std::move(arg)));
    };
    return FunctionFactory<decltype(wrapper), TArg, TContext, TExtFnRet>{wrapper};
}

template <typename TPFn, typename TPArg, typename TPContext, typename TPRet>
template <typename TFact>
constexpr auto FunctionFactory<TPFn, TPArg, TPContext, TPRet>::wrap(TFact const& functionFactory) const
{
    using TExtFnRet = typename TFact::TRet;

    auto wrapper = [other = m_callback, functionFactory](TContext context, TArg arg) {
        return functionFactory.m_callback(context, other(context, std::move(arg)));
    };
    return FunctionFactory<decltype(wrapper), TArg, TContext, TExtFnRet>{wrapper};
}

template <typename TPFn, typename TPArg, typename TPContext, typename TPRet>
auto FunctionFactory<TPFn, TPArg, TPContext, TPRet>::elide() const
{
    constexpr bool avoidsCopy = std::disjunction_v<std::is_reference<TArg>, std::is_pointer<TArg>>;
    using TVoidArg = std::conditional_t<
        avoidsCopy,
        std::conditional_t<std::is_const_v<std::remove_reference_t<std::remove_pointer_t<TArg>>>, void const*, void*>,
        void const*>;

    // it's required that we hide the details in std::function, otherwise the lambda will make our type unique...
    return createFunctionFactory(std::function{[callback = m_callback](TContext context, TVoidArg arg) -> TRet {
        if constexpr (std::is_pointer_v<TArg>)
        {
            return callback(context, static_cast<TArg>(arg));
        }
        else
        {
            using TCastTo = std::conditional_t<avoidsCopy, std::remove_reference_t<TArg>*, std::decay_t<TArg> const*>;
            return callback(context, *static_cast<TCastTo>(arg));
        }
    }});
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
    auto           offsets = TupleExt::getCombinationOffsets(pipelineStages);
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
