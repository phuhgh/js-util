#pragma once

#include <type_traits>

namespace JsUtil
{
template <typename T> struct Vec4
{
  public:
    T x;
    T y;
    T z;
    T w;
};
} // namespace JsUtil