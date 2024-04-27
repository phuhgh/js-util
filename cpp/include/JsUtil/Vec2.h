#pragma once

#include "JsUtil/Mat3.h"
#include <type_traits>

namespace JsUtil
{
template <typename T> struct Vec2
{
  public:
    T x;
    T y;

    void matrixMultiply(const Mat3<T> &_mat3)
    {
        matrixMultiply(_mat3, *this);
    }
    void matrixMultiply(Mat3<T> const &_mat, Vec2<T> &o_result) const
    {
        o_result.x = _mat.m_elements[0] * x + _mat.m_elements[3] * x + _mat.m_elements[6];
        o_result.y = _mat.m_elements[1] * y + _mat.m_elements[4] * y + _mat.m_elements[7];
    }
};
} // namespace JsUtil