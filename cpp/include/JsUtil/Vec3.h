#pragma once

#include <type_traits>

namespace JsUtil
{
template <typename T> struct Vec3
{
  public:
    T x;
    T y;
    T z;
};
} // namespace JsUtil