#pragma once

#include <array>

namespace JsUtil
{
template <typename T> struct Mat2
{
  public:
    std::array<T, 4> m_elements;

    T GetVec2MultiplyX(T x);
};
} // namespace JsUtil