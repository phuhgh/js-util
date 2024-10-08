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

// adapted from https://stackoverflow.com/questions/18063451/get-index-of-a-tuple-elements-type
template <size_t Index, typename TItem, typename TTuple>
constexpr size_t getItemIndex()
{
    static_assert(Index < std::tuple_size<TTuple>::value, "couldn't find the element");
    using TCurrentItem = typename std::tuple_element<Index, TTuple>::type;

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

/**
 * @brief Return all elements minus the first one.
 */
template <typename TTuple>
constexpr auto tail(TTuple&& tuple)
{
    constexpr auto Size = std::tuple_size_v<std::decay_t<TTuple>>;
    return [&tuple]<std::size_t... Is>(std::index_sequence<Is...>) {
        return std::make_tuple(std::get<1 + Is>(std::forward<TTuple>(tuple))...);
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
constexpr auto flattenCombinations(std::tuple<TInputs...> const& tuple)
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
constexpr auto reverse(TTuple&& tuple)
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

/// I.e. at runtime, by value. If the index is out of bound, YOU WILL GET THE FIRST ELEMENT!
template <class TTuple, size_t Index = 0>
auto* dynamicLookupByPtr(TTuple& tuple, size_t index)
{
    static_assert(
        IsUniform<TTuple>::value, "the tuple must be uniform for runtime indexing of this form to make sense"
    );

    if (Index == index)
    {
        return &std::get<Index>(tuple);
    }
    if constexpr (Index + 1 < std::tuple_size_v<TTuple>)
    {
        return dynamicLookupByPtr<TTuple, Index + 1>(tuple, index);
    }
    else
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            JsUtil::Debug::error("index out of range");
        }

        return &std::get<0>(tuple);
    }
}

template <class TTuple>
auto dynamicLookup(TTuple& tuple, size_t index)
{
    return *dynamicLookupByPtr(tuple, index);
}

} // namespace TupleExt
