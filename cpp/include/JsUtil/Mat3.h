#pragma once

#include <array>

namespace JsUtil
{
template <typename T> struct Mat3
{
  public:
    std::array<T, 9> m_elements;
};
} // namespace JsUtil