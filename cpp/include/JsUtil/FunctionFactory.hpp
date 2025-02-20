#pragma once

#include "JsUtil/FixedHashMap.hpp"
#include "JsUtil/Identifiers.hpp"
#include "JsUtil/LangExt.hpp"
#include "JsUtil/Number.hpp"
#include "JsUtil/SegmentedDataView.hpp"
#include "JsUtil/Tuple.hpp"

namespace Autogen
{

namespace Iterators
{

/**
 * @brief Takes a SegmentedDataView, calling the callback on each block within.
 */
constexpr auto scFOR_EACH_SEGMENT =
    []<class TContext, class TArg, class TStep>(TContext&& context, TArg&& items, TStep&& callback) {
        for (typename TArg::size_type i = 0, length = std::forward<TArg>(items).getLength(); i < length; ++i)
        {
            std::forward<TStep>(callback)(std::forward<TContext>(context), std::forward<TArg>(items).getBlock(i));
        }
    };

/**
 * @brief Takes a STL like container and iterates over its elements according to static options.
 */
template <JsUtil::SegmentedDataViewOptions TOptions>
constexpr auto scFOR_EACH_ELEMENT =
    []<class TContext, class TArg, class TStep>(TContext&& context, TArg&& items, TStep&& callback) {
        using TIndex = typename TArg::size_type;
        auto stride = static_cast<TIndex>(TOptions.stride);
        auto offset = static_cast<TIndex>(TOptions.offset);

        for (TIndex i = offset, end = std::forward<TArg>(items).size(); i < end; i += stride)
        {
            [&]<std::size_t... Is>(std::index_sequence<Is...>) {
                std::forward<TStep>(callback)(std::forward<TContext>(context), std::forward<TArg>(items)[i + Is]...);
            }(std::make_index_sequence<TOptions.blockSize>());
        }
    };
} // namespace Iterators

/**
 * @brief Only one iterator is supported at a given level.
 * @remark Because an iterator cannot be the first or last step, and it has to be the only step of its kind in its
 * stage, it doesn't need to be RTTI addressable in a unique way like other steps, it is essentially invisible.
 */
struct IteratorInteropConnectorToken
{
};

inline constexpr JsUtil::IdCategory<struct FFIterator> scFUNCTION_FACTORY_CATEGORIES{"JSU_FF_CAT"};
inline constexpr JsUtil::IdSpecialization<IteratorInteropConnectorToken, decltype(scFUNCTION_FACTORY_CATEGORIES)>
    scITERATOR_SPECIALIZATION{scFUNCTION_FACTORY_CATEGORIES, "JSU_FF_ITERATOR_SPEC"};

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
 * @brief Connects the previous pipeline step with the next step in the pipeline, iteration happening through the
 * iteratorCallback. See the namespace Iterators.
 */
template <typename TCallback>
struct IteratorConnector : IteratorInteropConnectorToken
{
    constexpr IteratorConnector(TCallback iteratorCallback)
        : m_iteratorCallback(iteratorCallback)
    {
    }

    template <typename TContext, typename TArg, typename TStep>
    constexpr auto createOne(TStep nextPipelineCallback) const
    {
        return [nextPipelineCallback, iteratorCallback = m_iteratorCallback](TContext&& context, TArg items) {
            iteratorCallback(std::forward<TContext>(context), std::forward<TArg>(items), nextPipelineCallback);
        };
    }

    TCallback m_iteratorCallback;
};

template <typename TCallback>
IteratorConnector(TCallback) -> IteratorConnector<TCallback>;

namespace Impl
{

template <typename T>
struct SpecializationMatcher;

template <typename TCallback>
struct SpecializationMatcher<IteratorConnector<TCallback>>
{
    static constexpr auto const& getSpecialization(IteratorConnector<TCallback> const&)
    {
        return scITERATOR_SPECIALIZATION;
    }
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

template <typename TCallback>
struct PipelineExtensions<IteratorConnector<TCallback>>
{
    template <typename TStep>
    static constexpr auto apply(TStep)
    {
        static_assert(false, "IteratorConnector must not be the last step");
    }

    template <typename TFactory, typename TStep>
    static constexpr auto apply(TFactory, TStep)
    {
        // encode each collection type in a step before (even if it's just identity), they will then be expanded out
        static_assert(false, "IteratorConnector must not be the first step");
    }

    template <typename TFactory, typename TPrevStep>
    static constexpr auto apply(TFactory const& factory, IteratorConnector<TCallback> const& step, TPrevStep)
    {
        using TContext = typename TFactory::TContext;
        using TFTraits = LangExt::FunctionTraits<typename TPrevStep::TFunction>;
        // the step before must be a regular function
        static_assert(TFTraits::arity == 2);
        using TArg = typename TFTraits::TRet;

        // step is itself a factory, which takes a callback to create the chainable
        return FunctionFactory(step.template createOne<TContext, TArg>(factory.m_callback));
    }
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
 * @remark In order to get the offset in applyFunctionFactory, just add up each "level" of the pipeline.
 * @remark Any stage which has only one option can be discounted from the calculation.
 * @remark No stage should have a duplicate specialization.
 */
template <typename... TPipelineSteps>
auto createFunctionMapping(std::tuple<TPipelineSteps...> pipelineStages);

} // namespace Autogen

#include "JsUtil/FunctionFactory.inl"