#pragma once

#include "JsUtil/LangExt.hpp"
#include "JsUtil/Tuple.hpp"
#include <utility>

namespace JsUtil
{

// todo jack: naming etc, try restricting this, if possible...
template <
    typename TFn,
    typename TFTraits = LangExt::FunctionTraits<TFn>,
    typename TArg = typename TFTraits::template argument<0>::type,
    typename TContext = typename TFTraits::template argument<1>::type,
    typename TRet = typename TFTraits::TRet>
class FunctionFactory
{
  public:
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
        auto wrapper = [other = m_callback, callback](TArg&& arg, TContext&& context) {
            return callback(other(std::forward<TArg>(arg), std::forward<TContext>(context)), std::forward<TContext>(context));
        };
        return FunctionFactory<decltype(wrapper)>(wrapper);
    }

    /**
     * @brief Extend the chain of function calls left, if A > B before, and calling with C, becomes C > A > B.
     */
    template <typename TFact>
    constexpr auto wrap(TFact const& functionFactory) const
    {
        auto wrapper = [other = m_callback, functionFactory](TArg&& arg, TContext&& context) {
            return functionFactory.m_callback(other(std::forward<TArg>(arg), std::forward<TContext>(context)), std::forward<TContext>(context));
        };
        return FunctionFactory<decltype(wrapper)>(wrapper);
    }

    constexpr TRet run(TArg&& arg, TContext&& context) const
    {
        return m_callback(std::forward<TArg>(arg), std::forward<TContext>(context));
    }

  private:
    TFn m_callback;
};

template <typename... TCombinations>
constexpr auto applyFunctionFactory(std::tuple<TCombinations...> const& combinations)
{
    return TupleExt::map(combinations, [](auto functions) {
        auto first = std::get<0>(functions);
        auto rest = TupleExt::tail(functions);

        return TupleExt::reduce(
            rest, [](auto factory, auto function) { return factory.extend(function); }, FunctionFactory(first)
        );
    });
}

} // namespace JsUtil
