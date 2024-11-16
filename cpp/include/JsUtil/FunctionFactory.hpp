#pragma once

#include "JsUtil/FixedHashMap.hpp"
#include "JsUtil/Identifiers.hpp"
#include "JsUtil/LangExt.hpp"
#include "JsUtil/Number.hpp"
#include "JsUtil/Tuple.hpp"
#include <span>

namespace Autogen
{

template <unsigned BlockSize>
struct ForEachConnector;
struct ForEachSpanConnector;

inline constexpr JsUtil::IdCategory<struct FFIterator>                               scITERATOR{"JSU_FF_ITERATOR"};
inline constexpr JsUtil::IdSpecialization<ForEachConnector<1>, decltype(scITERATOR)> scFOR_EACH_1{
    scITERATOR,
    "JSU_FF_FOR_EACH_1"
};
inline constexpr JsUtil::IdSpecialization<ForEachConnector<2>, decltype(scITERATOR)> scFOR_EACH_2{
    scITERATOR,
    "JSU_FF_FOR_EACH_2"
};
inline constexpr JsUtil::IdSpecialization<ForEachConnector<3>, decltype(scITERATOR)> scFOR_EACH_3{
    scITERATOR,
    "JSU_FF_FOR_EACH_3"
};
inline constexpr JsUtil::IdSpecialization<ForEachSpanConnector, decltype(scITERATOR)> scFOR_EACH_SPAN{
    scITERATOR,
    "JSU_FF_FOR_EACH_SPAN"
};

template <typename TSpecialization, typename TFn>
struct FuncStep
{
    using TFunction = TFn;

    constexpr FuncStep(TSpecialization const& specialization, TFn function)
        : specialization(specialization)
        , function(function)
    {
    }
    TSpecialization const& specialization;
    TFn                    function;
};

template <typename TFn>
class FunctionFactory
{
  public:
    using TFTraits = LangExt::FunctionTraits<TFn>;
    using TArg = typename TFTraits::template argument<1>::type;
    using TContext = typename TFTraits::template argument<0>::type;
    using TRet = typename TFTraits::TRet;

    constexpr explicit FunctionFactory(TFn callback)
        : m_callback(callback)
    {
    }

    /**
     * @brief Extend the chain of function calls right. If `this` is A, and `callback` is B, the result would be A > B.
     */
    template <typename TExtFn>
    constexpr auto extend(TExtFn const& callback) const
    {
        auto wrapper = [other = m_callback, callback](TContext&& context, TArg&& arg) {
            return callback(
                std::forward<TContext>(context), other(std::forward<TContext>(context), std::forward<TArg>(arg))
            );
        };
        return FunctionFactory<decltype(wrapper)>(wrapper);
    }

    /**
     * @brief Extend the chain of function calls left. If `functionFactory` is A, and `this` is B, the result
     * would be B > A.
     */
    template <typename TFact>
    constexpr auto wrap(TFact const& functionFactory) const
    {
        auto wrapper = [other = m_callback, functionFactory](TContext&& context, TArg&& arg) {
            return functionFactory.m_callback(
                std::forward<TContext>(context), other(std::forward<TContext>(context), std::forward<TArg>(arg))
            );
        };
        return FunctionFactory<decltype(wrapper)>(wrapper);
    }

    constexpr TRet run(TContext&& context, TArg&& arg) const
    {
        return m_callback(std::forward<TContext>(context), std::forward<TArg>(arg));
    }

    TFn m_callback;
};

/**
 * @brief Connects the previous pipeline step (which should return some STL like collection) with the next function in
 * the pipeline.
 *
 * Optionally You may specify an `offset`, `end` and `stride` - which all have the usual meaning. The `BlockSize`
 * should be smaller than the stride, and provides a window into the data, which is "spread" over the callback, e.g. for
 * a block size of 2 the callback signature would be TRet *(TContext, TItem, TItem).
 */
template <unsigned BlockSize>
struct ForEachConnector
{
    struct Options
    {
        static constexpr unsigned blockSize{BlockSize};
        unsigned                  stride{BlockSize};
        unsigned                  offset{0};
        size_t                    end{std::numeric_limits<size_t>::max()};
    };

    template <typename TContext, typename TArg, typename TFunction>
    constexpr auto createOne(TFunction callback) const;

    Options options;
};

template <typename T>
ForEachConnector(T) -> ForEachConnector<T::blockSize>;
ForEachConnector() -> ForEachConnector<1>;

/**
 * @brief Connects the previous pipeline step (which should return some STL like collection) with the next step in
 * the pipeline.
 *
 * Optionally You may specify an `offset`, `end` and `stride` - which all have the usual meaning. The `spanSize`
 * should be smaller than the stride, and provides a window into the data via std::span, which is provided in the
 * callback.
 */
struct ForEachSpanConnector
{
    struct Options
    {
        unsigned spanSize{1};
        unsigned stride{spanSize};
        unsigned offset{0};
        size_t   end{std::numeric_limits<size_t>::max()};
    };

    template <typename TContext, typename TArg, typename TStep>
    constexpr auto createOne(TStep callback) const;

    Options options;
};

namespace Impl
{

template <typename T>
struct SpecializationMatcher;

template <unsigned BlockSize>
struct SpecializationMatcher<ForEachConnector<BlockSize>>
{
    static constexpr auto const& getSpecialization(ForEachConnector<BlockSize> const&);
};

template <>
struct SpecializationMatcher<ForEachSpanConnector>
{
    static constexpr auto const& getSpecialization(ForEachSpanConnector const&) { return scFOR_EACH_SPAN; }
};

template <typename TSpecialization, typename TFn>
struct SpecializationMatcher<FuncStep<TSpecialization, TFn>>
{
    static constexpr TSpecialization const& getSpecialization(FuncStep<TSpecialization, TFn> const& spec)
    {
        return spec.specialization;
    }
};

template <typename>
struct PipelineExtensions;

template <typename TSpecialization, typename TFn>
struct PipelineExtensions<FuncStep<TSpecialization, TFn>>
{
    static constexpr auto apply(FuncStep<TSpecialization, TFn> const& step) { return FunctionFactory(step.function); }

    template <typename TFactory>
    static constexpr auto apply(TFactory&& factory, FuncStep<TSpecialization, TFn> const& step)
    {
        // it should be a plain function
        return FunctionFactory(step.function).wrap(std::forward<TFactory>(factory));
    }

    template <typename TFactory, typename TPrevStep>
    static constexpr auto apply(TFactory&& factory, FuncStep<TSpecialization, TFn> const& step, TPrevStep&&)
    {
        // it should be a plain function
        return FunctionFactory(step.function).wrap(std::forward<TFactory>(factory));
    }
};

template <unsigned BlockSize>
struct PipelineExtensions<ForEachConnector<BlockSize>>
{
    template <typename TStep>
    static constexpr auto apply(TStep)
    {
        static_assert(false, "ForEachConnector must not be the last step");
    }

    template <typename TFactory>
    static constexpr auto apply(TFactory, ForEachConnector<BlockSize> const&)
    {
        // encode each collection type in a step before (even if it's just identity), they will then be expanded out
        static_assert(false, "ForEachConnector must not be the first step");
    }

    template <typename TFactory, typename TPrevStep>
    static constexpr auto apply(TFactory factory, ForEachConnector<BlockSize> const& step, TPrevStep);
};

template <>
struct PipelineExtensions<ForEachSpanConnector>
{
    template <typename TStep>
    static constexpr auto apply(TStep)
    {
        static_assert(false, "ForEachSpanConnector must not be the last step");
    }

    template <typename TFactory, typename TStep>
    static constexpr auto apply(TFactory, TStep)
    {
        // encode each collection type in a step before (even if it's just identity), they will then be expanded out
        static_assert(false, "ForEachSpanConnector must not be the first step");
    }

    template <typename TFactory, typename TPrevStep>
    static constexpr auto apply(TFactory const& factory, ForEachSpanConnector const& step, TPrevStep);
};

} // namespace Impl

/**
 *@brief Generates all possible permutations of `pipelineSteps` at compile time. This prevents the need for runtime
 *lookups / use of interfaces in inner loops, while maintaining a composition approach with (typically) perfect
 *inlining in the inner loops.
 */
template <typename... TPipelineSteps>
consteval auto applyFunctionFactory(std::tuple<TPipelineSteps...> const& pipelineSteps);

/**
 * @brief The categories which an entity must belong to in order to be allowed for use in the pipeline.
 */
template <typename... TPipelineSteps>
auto getRequiredCategories(std::tuple<TPipelineSteps...> pipelineStages);

/**
 * @brief Creates a mapping between categories and specializations onto the function index.
 */
template <typename... TPipelineSteps>
auto createFunctionMapping(std::tuple<TPipelineSteps...> pipelineStages);

} // namespace Autogen

#include "JsUtil/FunctionFactory.inl"