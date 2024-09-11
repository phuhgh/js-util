#pragma once

#include "JsUtil/LangExt.hpp"
#include <tuple>

namespace
{

template <std::size_t I = 0, typename TFn, typename TAcc, typename TTuple>
constexpr auto reduceRecursive(TTuple const& tuple, TFn&& callback, TAcc&& accumulator)
{
    if constexpr (I < std::tuple_size_v<TTuple>)
    {
        return reduceRecursive<I + 1>(
            tuple, std::forward<TFn>(callback), callback(std::forward<TAcc>(accumulator), std::get<I>(tuple))
        );
    }
    else
    {
        return std::forward<TAcc>(accumulator);
    }
}

} // namespace

namespace TupleExt
{

/**
 * @brief Return all elements minus the first one.
 */
template <typename Tuple>
constexpr auto tail(Tuple&& tuple)
{
    constexpr auto Size = std::tuple_size_v<std::decay_t<Tuple>>;
    return [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<1 + Is>(std::forward<Tuple>(tuple))...);
    }(std::make_index_sequence<Size - 1>());
}

template <typename TCallback, typename... TTuple>
constexpr void forEach(std::tuple<TTuple...> const& tuple, TCallback&& callback)
{
    std::apply(
        [&callback](auto&&... args) { (std::forward<TCallback>(callback)(std::forward<decltype(args)>(args)), ...); },
        tuple
    );
}

template <typename... TInput, typename TCallback>
constexpr auto map(std::tuple<TInput...> const& tuple, TCallback callback)
{
    return std::apply(
        [&callback](auto&&... args) { return std::make_tuple(callback(std::forward<decltype(args)>(args))...); }, tuple
    );
}

template <typename TFn, typename TAcc, typename... TTuple>
constexpr auto reduce(std::tuple<TTuple...> const& tuple, TFn&& callback, TAcc&& accumulator)
{
    return reduceRecursive<0, TFn, TAcc, std::tuple<TTuple...>>(
        tuple, std::forward<TFn>(callback), std::forward<TAcc>(accumulator)
    );
}

template <size_t i = 0, typename... TInput, typename TCallback>
constexpr auto flatMap(std::tuple<TInput...> const& tuple, TCallback&& callback)
{
    using TTuple = decltype(tuple);

    if constexpr (i < std::tuple_size<std::decay_t<TTuple>>())
    {
        auto result = std::forward<TCallback>(callback)(std::get<i>(tuple));
        auto rest = flatMap<i + 1>(tuple, std::forward<TCallback>(callback));
        return std::tuple_cat(result, rest);
    }
    else
    {
        return std::tuple<>{};
    }
}

template <typename... TInputs>
constexpr auto combinatorial(std::tuple<TInputs...> const& tuple)
{
    using TTuple = std::tuple<TInputs...>;

    if constexpr (0 < std::tuple_size_v<TTuple>)
    {
        auto first = std::get<0>(tuple);
        auto combinationsOfRest = combinatorial(tail(tuple));

        return flatMap(first, [&combinationsOfRest](auto element) {
            return map(combinationsOfRest, [&element](auto combination) {
                return std::tuple_cat(std::make_tuple(element), combination);
            });
        });
    }
    else
    {
        return std::tuple<std::tuple<>>{std::tuple<>{}};
    }
}
} // namespace TupleExt
