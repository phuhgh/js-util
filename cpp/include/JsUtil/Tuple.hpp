#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/LangExt.hpp"
#include <tuple>

// ReSharper disable once CppUnnamedNamespaceInHeaderFile
namespace
{

template <std::size_t I = 0, typename TFn, typename TAcc, typename TTuple>
constexpr auto reduceRecursive(TTuple const& tuple, TFn&& callback, TAcc&& accumulator)
{
    if constexpr (I < std::tuple_size_v<std::decay_t<TTuple>>)
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

// adapted from https://stackoverflow.com/questions/18063451/get-index-of-a-tuple-elements-type
template <size_t Index, typename TItem, typename TTuple>
constexpr size_t getItemIndex()
{
    using TDecayedTuple = std::decay_t<TTuple>;
    static_assert(Index < std::tuple_size<TDecayedTuple>::value, "couldn't find the element");
    using TCurrentItem = typename std::tuple_element<Index, TDecayedTuple>::type;

    if constexpr (std::is_same_v<TItem, TCurrentItem>)
    {
        return Index;
    }
    else
    {
        return getItemIndex<Index + 1, TItem, TTuple>();
    }
}

} // namespace

namespace TupleExt
{

template <typename T>
using RepeatedPair = std::pair<T, T>;

/**
 * @brief Return all elements minus the first one.
 */
template <typename TTuple>
[[nodiscard]] constexpr auto tail(TTuple&& tuple)
{
    constexpr auto Size = std::tuple_size_v<std::decay_t<TTuple>>;
    return [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<1 + Is>(std::forward<TTuple>(tuple))...);
    }(std::make_index_sequence<Size - 1>());
}

template <typename TCallback, typename... TTuple>
constexpr void forEach(std::tuple<TTuple...> const& tuple, TCallback&& callback)
{
    if constexpr (std::invocable<TCallback, decltype(std::get<0>(tuple)), size_t>)
    {
        return [&tuple, &callback]<std::size_t... Is>(std::index_sequence<Is...>) {
            ((callback(std::get<Is>(tuple), Is)), ...);
        }(std::make_index_sequence<sizeof...(TTuple)>{});
    }
    else
    {
        std::apply(
            [&callback](auto&&... args) {
                (std::forward<TCallback>(callback)(std::forward<decltype(args)>(args)), ...);
            },
            tuple
        );
    }
}

template <typename... TTuple, typename TCallback>
[[nodiscard]] constexpr auto map(std::tuple<TTuple...> const& tuple, TCallback&& callback)
{
    if constexpr (std::invocable<TCallback, decltype(std::get<0>(tuple)), size_t>)
    {
        return [&tuple, &callback]<std::size_t... Is>(std::index_sequence<Is...>) {
            return std::make_tuple(
                std::invoke(
                    std::forward<TCallback>(callback), std::get<Is>(std::forward<decltype(tuple)>(tuple)), Is
                )...
            );
        }(std::make_index_sequence<sizeof...(TTuple)>{});
    }
    else
    {
        return std::apply(
            [&callback](auto&&... args) {
                return std::make_tuple(
                    std::invoke(std::forward<TCallback>(callback), std::forward<decltype(args)>(args))...
                );
            },
            tuple
        );
    }
}

template <typename TFn, typename TAcc, typename... TTuple>
[[nodiscard]] constexpr auto reduce(std::tuple<TTuple...> const& tuple, TFn&& callback, TAcc&& accumulator)
{
    return reduceRecursive<0, TFn, TAcc, std::tuple<TTuple...>>(
        tuple, std::forward<TFn>(callback), std::forward<TAcc>(accumulator)
    );
}

template <size_t i = 0, typename... TInput, typename TCallback>
[[nodiscard]] constexpr auto flatMap(std::tuple<TInput...> const& tuple, TCallback&& callback)
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

/**
 *@brief Multiplies out tuple combinations to a depth of 2, e.g.:
 * [
 *   [A, B],
 *   [C, D]
 * ]
 *
 * Would become:
 * [
 *   [A, C],
 *   [A, D],
 *   [B, C],
 *   [B, D]
 * ]
 */

template <typename... TInputs>
[[nodiscard]] constexpr auto flattenCombinations(std::tuple<TInputs...> const& tuple)
{
    using TTuple = std::tuple<TInputs...>;

    if constexpr (0 < std::tuple_size_v<TTuple>)
    {
        auto first = std::get<0>(tuple);
        auto combinationsOfRest = flattenCombinations(tail(tuple));

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

template <typename TTuple>
[[nodiscard]] constexpr auto reverse(TTuple&& tuple)
{
    constexpr auto Size = std::tuple_size_v<std::decay_t<TTuple>>;

    return [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<Size - 1 - Is>(std::forward<TTuple>(tuple))...);
    }(std::make_index_sequence<Size>{});
}

template <typename TElement, typename TTuple>
struct IndexOf
{
    static constexpr size_t value = getItemIndex<0, TElement, TTuple>();
};

// https://stackoverflow.com/questions/76107260/is-there-anyway-to-find-stdtuple-elements-are-all-same-type-or-not
template <typename TFirst, typename... TRest>
struct IsUniform
{
    constexpr static bool value = std::is_same_v<std::tuple<TFirst, TRest...>, std::tuple<TRest..., TFirst>>;
};

template <typename... TElements>
struct IsUniform<std::tuple<TElements...>> : IsUniform<TElements...>
{
};

template <typename... TTuple>
constexpr bool IsUniformValue = IsUniform<TTuple...>::value;

template <typename>
struct CommonType
{
};

template <typename... TElements>
struct CommonType<std::tuple<TElements...>>
{
    using type = std::common_type_t<TElements...>;
};

template <typename... TElements>
struct CommonType<std::tuple<TElements...> const>
{
    using type = std::common_type_t<TElements...> const;
};

template <typename... TElements>
struct CommonType<std::tuple<TElements...>&>
{
    using type = std::common_type_t<TElements...>&;
};

template <typename... TElements>
struct CommonType<std::tuple<TElements...> const&>
{
    using type = std::common_type_t<TElements...> const&;
};

/**
 * @brief Lookup an index without requiring a templated index. If the `indexToFind` is out of bounds, you will get
 * nullptr. In a constexpr setting you should see a (probably unhelpful) debug error.
 * @remarks This only makes sense where the tuple type is uniform.
 */
template <typename TTuple, size_t Index = 0>
[[nodiscard]] constexpr auto select(TTuple& tuple, size_t indexToFind)
    -> std::remove_reference_t<typename CommonType<TTuple>::type>&
{
    static_assert(!std::is_rvalue_reference_v<decltype(tuple)>, "tuple must be a l-value reference");

    if (Index == indexToFind)
    {
        return std::get<Index>(tuple);
    }
    if constexpr (Index + 1 < std::tuple_size_v<std::decay_t<TTuple>>)
    {
        return select<TTuple, Index + 1>(tuple, indexToFind);
    }
    else
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            // this isn't constexpr, so if you see a compile error here, you went out of bounds...
            // we can't just static assert here, because this path is required for non-constexpr uses
            JsUtil::Debug::error("indexToFind out of range");
        }

        return std::get<0>(tuple);
    }
}

template <typename TTuple, size_t Index = 0>
[[nodiscard]] constexpr auto select(TTuple const& tuple, size_t indexToFind)
    -> std::remove_reference_t<typename CommonType<TTuple>::type>
{
    static_assert(!std::is_rvalue_reference_v<decltype(tuple)>, "tuple must be a l-value reference");

    if (Index == indexToFind)
    {
        return std::get<Index>(tuple);
    }
    if constexpr (Index + 1 < std::tuple_size_v<std::decay_t<TTuple>>)
    {
        return select<TTuple, Index + 1>(tuple, indexToFind);
    }
    else
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            // this isn't constexpr, so if you see a compile error here, you went out of bounds...
            // we can't just static assert here, because this path is required for non-constexpr uses
            JsUtil::Debug::error("indexToFind out of range");
        }

        return std::get<0>(tuple);
    }
}

/**
 * @brief Put up to (but not including) `Index` into the first half, the rest goes into the second half.
 */
template <std::size_t Index, typename TTuple>
[[nodiscard]] constexpr auto splitAt(TTuple&& tuple)
{
    static_assert(Index <= std::tuple_size_v<std::decay_t<TTuple>>, "index out of bounds");

    auto h1 = [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<Is>(std::forward<TTuple>(tuple))...);
    }(std::make_index_sequence<Index>{});

    auto h2 = [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<Index + Is>(std::forward<TTuple>(tuple))...);
    }(std::make_index_sequence<std::tuple_size_v<std::decay_t<TTuple>> - Index>{});

    return std::make_tuple(std::move(h1), std::move(h2));
}

} // namespace TupleExt
