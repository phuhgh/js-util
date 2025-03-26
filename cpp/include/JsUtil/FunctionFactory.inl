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

} // namespace Impl

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
