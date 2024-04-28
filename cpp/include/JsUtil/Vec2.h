#pragma once

#include "JsUtil/Mat3.h"
#include <array>

namespace JsUtil
{
template <typename T> struct Vec2
{
  public:
    static constexpr int scSIZE = 2;

    Vec2() = default;
    explicit Vec2(std::array<T, scSIZE> values)
        : m_elements(std::move(values))
    {
    }

    T  x() const { return m_elements[0]; }
    T  y() const { return m_elements[1]; };
    T& operator[](int index) { return m_elements[index]; }
    T  operator[](int index) const { return m_elements[index]; }

    std::array<T, scSIZE>*       asArray() { return &m_elements; }
    std::array<T, scSIZE> const* asArray() const { return &m_elements; }
    static constexpr int         size() { return scSIZE; }

    void matrixMultiply(Mat3<T> const& _mat3) { matrixMultiply(_mat3, *this); }

    void matrixMultiply(Mat3<T> const& _mat, Vec2<T>* o_result) const
    {
        o_result->x = _mat[0] * x() + _mat[3] * x() + _mat[6];
        o_result->y = _mat[1] * y() + _mat[4] * y() + _mat[7];
    }

  private:
    std::array<T, scSIZE> m_elements;
};
} // namespace JsUtil