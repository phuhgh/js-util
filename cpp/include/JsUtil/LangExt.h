#pragma once

#include <array>
#include <type_traits>

namespace LangExt
{

inline auto identity = [](auto const& v) { return v; };

inline auto noop = [](...) {};

} // namespace LangExt