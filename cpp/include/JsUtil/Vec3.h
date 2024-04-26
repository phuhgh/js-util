#pragma once

#include <type_traits>

namespace JsUtil
{
template <typename T> struct Vec3
{
  public:
    T m_x;
    T m_y;
    T m_z;
};
} // namespace JsUtil