#pragma once

#include <tuple>

namespace TupleExt
{

template <typename Tuple>
constexpr auto tail(Tuple&& tuple)
{
    constexpr auto Size = std::tuple_size_v<std::decay_t<Tuple>>;
    return [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<1 + Is>(std::forward<Tuple>(tuple))...);
    }(std::make_index_sequence<Size - 1>());
}

template <size_t i = 0, typename... TInput, typename TCallback>
constexpr auto map(std::tuple<TInput...> tuple, TCallback callback)
{
    using TTuple = decltype(tuple);

    if constexpr (i < std::tuple_size<TTuple>())
    {
        auto                         result = callback(std::get<i>(tuple));
        std::tuple<decltype(result)> first{result};
        auto                         rest = tail(tuple);
        return std::tuple_cat(first, map<i>(rest, callback));
    }
    else
    {
        return std::tuple<>{};
    }
}

template <size_t i = 0, typename... TInput, typename TCallback>
constexpr auto flatMap(std::tuple<TInput...> tuple, TCallback callback)
{
    using TTuple = decltype(tuple);

    if constexpr (i < std::tuple_size<TTuple>())
    {
        auto result = callback(std::get<i>(tuple));
        auto rest = flatMap<i + 1>(tuple, callback);
        return std::tuple_cat(result, rest);
    }
    else
    {
        return std::tuple<>{};
    }
}

template <typename... TInputs>
constexpr auto combinatorial(std::tuple<TInputs...> tuple)
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
