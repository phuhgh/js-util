#pragma once

#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include <span>

namespace Autogen
{

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
     * @brief Extend the chain of function calls right, if A > B before, and calling with C, becomes A > B > C.
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
     * @brief Extend the chain of function calls left, if A > B before, and calling with C, becomes C > A > B.
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
    constexpr auto createOne(TFunction callback)
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

    Options options;
};

template <typename T>
ForEachConnector(T) -> ForEachConnector<T::blockSize>;
ForEachConnector() -> ForEachConnector<1>;

/**
 * @brief Connects the previous pipeline step (which should return some STL like collection) with the next function in
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

    template <typename TContext, typename TArg, typename TFunction>
    constexpr auto createOne(TFunction callback)
    {
        return [callback, _opts = options](TContext&& context, TArg items) {
            using TIndex = typename TArg::size_type;

            auto const spanSize = static_cast<TIndex>(_opts.spanSize);
            auto const stride = static_cast<TIndex>(_opts.stride);
            auto const offset = static_cast<TIndex>(_opts.offset);
            auto const end = std::min(static_cast<TIndex>(_opts.end), items.size());

            for (TIndex i = offset; i < end; i += stride)
            {
                callback(std::forward<TContext>(context), std::span{&items[i], spanSize});
            }
        };
    }

    Options options;
};

namespace Impl
{

template <typename>
struct PipelineExtensions
{
    template <typename TFactory, typename TFunction>
    static constexpr auto apply(TFactory&& factory, TFunction&& function)
    {
        // it should be a plain function
        return FunctionFactory(std::forward<TFunction>(function)).wrap(std::forward<TFactory>(factory));
    }
    template <typename TFactory, typename TFunction, typename TPreviousFunction>
    static constexpr auto apply(TFactory&& factory, TFunction&& function, TPreviousFunction&&)
    {
        // it should be a plain function
        return FunctionFactory(std::forward<TFunction>(function)).wrap(std::forward<TFactory>(factory));
    }
};

template <unsigned BlockSize>
struct PipelineExtensions<ForEachConnector<BlockSize>>
{
    template <typename TFactory, typename TFunction>
    static constexpr auto apply(TFactory, TFunction)
    {
        // encode each collection type in a step before (even if it's just identity), they will then be expanded out
        static_assert(false, "ForEachConnector must not be the first function");
    }
    template <typename TFactory, typename TFunction, typename TPreviousFunction>
    static constexpr auto apply(TFactory factory, TFunction function, TPreviousFunction)
    {
        using TContext = typename decltype(factory)::TContext;
        using TFTraits = LangExt::FunctionTraits<TPreviousFunction>;
        // the step before must be a regular function
        static_assert(TFTraits::arity == 2);
        using TArg = typename TFTraits::TRet;

        // function is itself a factory, which takes a callback to create the chainable
        return FunctionFactory(function.template createOne<TContext, TArg>(factory.m_callback));
    }
};

template <>
struct PipelineExtensions<ForEachSpanConnector>
{
    template <typename TFactory, typename TFunction>
    static constexpr auto apply(TFactory, TFunction)
    {
        // encode each collection type in a step before (even if it's just identity), they will then be expanded out
        static_assert(false, "ForEachSpanConnector must not be the first function");
    }
    template <typename TFactory, typename TFunction, typename TPreviousFunction>
    static constexpr auto apply(TFactory factory, TFunction function, TPreviousFunction)
    {
        using TContext = typename decltype(factory)::TContext;
        using TFTraits = LangExt::FunctionTraits<TPreviousFunction>;
        // the step before must be a regular function
        static_assert(TFTraits::arity == 2);
        using TArg = typename TFTraits::TRet;

        // function is itself a factory, which takes a callback to create the chainable
        return FunctionFactory(function.template createOne<TContext, TArg>(factory.m_callback));
    }
};

} // namespace Impl

/**
 *@brief Generates all possible permutations of `pipelineSteps` at compile time. This prevents the need for runtime
 *lookups / use of interfaces in inner loops, while maintaining a composition approach with (typically) perfect
 *inlining in the inner loops.
 */
template <typename... TPipelineSteps>
constexpr auto applyFunctionFactory(std::tuple<TPipelineSteps...> const& pipelineSteps)
{
    return TupleExt::map(pipelineSteps, [](auto functions) {
        auto reversedFunctions = TupleExt::reverse(functions);
        auto last = std::get<0>(reversedFunctions);
        auto rest = TupleExt::tail(reversedFunctions);

        return TupleExt::reduce(
            rest,
            [&functions](auto factory, auto function) {
                constexpr auto Index = TupleExt::IndexOf<decltype(function), decltype(functions)>::value;
                if constexpr (Index > 0)
                {
                    auto nextFunction = std::get<Index - 1>(functions);
                    // we're going backwards, so it's next, but in logical order this is the step before...
                    return Impl::PipelineExtensions<decltype(function)>::apply(factory, function, nextFunction);
                }
                else
                {
                    return Impl::PipelineExtensions<decltype(function)>::apply(factory, function);
                }
            },
            FunctionFactory(last)
        );
    });
}

} // namespace Autogen
