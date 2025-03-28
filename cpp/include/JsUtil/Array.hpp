#pragma once

#include <algorithm>
#include <array>

namespace ArrayExt
{
namespace Impl
{
template <typename T, std::size_t N1, std::size_t N2, std::size_t... I1, std::size_t... I2>
constexpr auto
concatCreate(std::array<T, N1> const& arr1, std::array<T, N2> const& arr2, std::index_sequence<I1...>, std::index_sequence<I2...>)
{
    return std::array<T, N1 + N2>{arr1[I1]..., arr2[I2]...};
}
} // namespace Impl

template <typename T, std::size_t N1, std::size_t N2>
constexpr auto concat(std::array<T, N1> const& arr1, std::array<T, N2> const& arr2)
{
    return Impl::concatCreate(arr1, arr2, std::make_index_sequence<N1>{}, std::make_index_sequence<N2>{});
}

} // namespace ArrayExt
