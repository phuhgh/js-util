#pragma once

#include "JsUtil/Mat3.h"
#include <type_traits>

namespace JsUtil
{
template <typename T> struct Vec2
{
  public:
    T m_x;
    T m_y;

    void matrixMultiply(const Mat3<T> &_mat3)
    {
        matrixMultiply(_mat3, *this);
    }
    void matrixMultiply(Mat3<T> const &_mat, Vec2<T> &o_result) const
    {
        o_result.m_x = _mat.m_elements[0] * m_x + _mat.m_elements[3] * m_x + _mat.m_elements[6];
        o_result.m_y = _mat.m_elements[1] * m_y + _mat.m_elements[4] * m_y + _mat.m_elements[7];
    }
};
} // namespace JsUtil