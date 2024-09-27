#pragma once

#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include <utility>

namespace JsUtil
{

// todo jack: basically the idea of branching is required, everything else is just a kludge
// todo jack: naming etc, try restricting this, if possible...
template <
    typename TFn,
    typename TFTraits = LangExt::FunctionTraits<TFn>,
    typename TArg = typename TFTraits::template argument<1>::type,
    typename TContext = typename TFTraits::template argument<0>::type,
    typename TRet = typename TFTraits::TRet>
class FunctionFactory
{
  public:
    using Arg = TArg;
    using Context = TContext;

    constexpr explicit FunctionFactory(TFn callback)
        : m_callback(callback)
    {
    }

    // todo jack: restrict if possible...
    /**
     * @brief Extend the chain of function calls right, if A > B before, and calling with C, becomes A > B > C.
     */
    template <typename TExtFn>
    constexpr auto extend(TExtFn const& callback) const
    {
        auto wrapper = [other = m_callback, callback](TContext context, TArg&& arg) {
            return callback(
                std::forward<TContext>(context), other(std::forward<TContext>(context), std::forward<TArg>(arg))
            );
        };
        return FunctionFactory<decltype(wrapper)>(wrapper);
    }

    // todo jack: unit tests for perfect forwarding, logically this should probably just be a free function
    // todo jack: better docs, it's not obvious which is the wrapped one
    /**
     * @brief Extend the chain of function calls left, if A > B before, and calling with C, becomes C > A > B.
     */
    template <typename TFact>
    constexpr auto wrap(TFact const& functionFactory) const
    {
        auto wrapper = [other = m_callback, functionFactory](TContext context, TArg&& arg) {
            return functionFactory.m_callback(
                std::forward<TContext>(context), other(std::forward<TContext>(context), std::forward<TArg>(arg))
            );
        };
        return FunctionFactory<decltype(wrapper)>(wrapper);
    }

    constexpr TRet run(TContext context, TArg&& arg) const
    {
        return m_callback(std::forward<TContext>(context), std::forward<TArg>(arg));
    }

    // todo jack: HACK!, maybe hide it in a parent class or something? (problem is that it's templated, therefore
    // unrelated)
  public:
    TFn m_callback;
};

// todo jack: restrict this if possible, deduction guide?
struct ForEachFactory
{
    template <typename TContext, typename TArg, typename TFunction>
    constexpr auto createOne(TFunction callback)
    {
        return [callback](TContext context, TArg items) {
            // todo jack: obviously we need to support windows into the data etc...
            // todo jack: does the & matter here for trivial types
            for (auto item : items)
            {
                callback(std::forward<TContext>(context), item);
            }
        };
    }
};

// todo jack: the naming no longer makes much sense...
template <typename>
struct AttributeTraits
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

// todo jack: perfect forwarding etc
template <>
struct AttributeTraits<ForEachFactory>
{
    template <typename TFactory, typename TFunction>
    static constexpr auto apply(TFactory, TFunction)
    {
        // encode each collection type in a step before (even if it's just identity), they will then be expanded out
        static_assert(false, "ForEachFactory must not be the first function");
    }
    template <typename TFactory, typename TFunction, typename TPreviousFunction>
    static constexpr auto apply(TFactory factory, TFunction function, TPreviousFunction)
    {
        using TContext = typename decltype(factory)::Context;
        using TFTraits = LangExt::FunctionTraits<TPreviousFunction>;
        // the step before must be a regular function
        static_assert(TFTraits::arity == 2);
        using TArg = typename TFTraits::TRet;

        // function it is itself a factory, which takes a callback to create the chainable
        return FunctionFactory(function.template createOne<TContext, TArg>(factory.m_callback));
    }
};

/**
 * todo jack: documentation with example, document that empty is not permitted
 * todo jack: concrete use case:
 * - multiple kinds of containers, multiple kinds of things to index into
 *
 * for each container (e.g. interleaved, parallel, linked list etc),
 * for each data arrangement (e.g. points, lines, etc),
 * for each indexer (e.g. quad tree)
 *
 *
 * this might be the more appropriate place to handle that idea, the idea is really only useful where generated
 */

template <typename... TCombinations>
constexpr auto applyFunctionFactory(std::tuple<TCombinations...> const& combinations)
{
    return TupleExt::map(combinations, [](auto functions) {
        auto reversedFunctions = TupleExt::reverse(functions);
        auto last = std::get<0>(reversedFunctions);
        auto rest = TupleExt::tail(reversedFunctions);

        /**
         *todo jack: so the thing that's totally fucking here is this:
         *I need to start from the back to collect the functions to put into operators
         *but I also need to start from the front so we can know what the fucking collection types are
         *we can't really encode that, as one of the requirements is to be container agnostic...
         *I say that, we have the expansion system, so in principle you can just hard code a list and it will be
         *expanded for you... this is accetpable
         */

        return TupleExt::reduce(
            rest,
            [&functions](auto factory, auto function) {
                // todo jack: big doubt that the indexing will be correct, map it out
                constexpr auto Index = TupleExt::IndexOf<decltype(function), decltype(functions)>::value;
                if constexpr (Index > 0)
                {
                    auto nextFunction = std::get<Index - 1>(functions);
                    // we're going backwards, so it's next, but in logical order this is the step before...
                    return AttributeTraits<decltype(function)>::apply(factory, function, nextFunction);
                }
                else
                {
                    return AttributeTraits<decltype(function)>::apply(factory, function);
                }
            },
            FunctionFactory(last)
        );
    });
}

} // namespace JsUtil
