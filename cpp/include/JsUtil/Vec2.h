#pragma once

#include "JsUtil/Mat3.h"

namespace JsUtil
{

template <typename T> class Vec2 : public AVectorBase<T, 2, Vec2<T>>
{
  public:
    using AVectorBase<T, 2, Vec2<T>>::AVectorBase;

    T x() const { return Vec2<T>::AVectorBase::m_elements[0]; }
    T y() const { return Vec2<T>::AVectorBase::m_elements[1]; };

    T min() const { return Vec2<T>::AVectorBase::m_elements[0]; }
    T max() const { return Vec2<T>::AVectorBase::m_elements[1]; };

    void setX(T x_val) { Vec2<T>::AVectorBase::m_elements[0] = x_val; }
    void setY(T y_val) { Vec2<T>::AVectorBase::m_elements[1] = y_val; }

    template <typename U> void matrixMultiply(Mat3<U> const& _mat, Vec2<T>* o_result) const
    {
        o_result->m_elements[0] = _mat[0] * x() + _mat[3] * x() + _mat[6];
        o_result->m_elements[1] = _mat[1] * y() + _mat[4] * y() + _mat[7];
    }
    template <typename U> void matrixMultiply(Mat3<U> const& _mat3) { matrixMultiply(_mat3, this); }
};

static_assert(std::is_trivial_v<Vec2<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Vec2<float>>, "standard layout required");

} // namespace JsUtil