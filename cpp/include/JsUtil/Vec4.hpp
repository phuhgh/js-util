#pragma once

#include "JsUtil/Impl/VectorBase.h"

namespace JsUtil
{

template <typename T>
class Vec4 : public AVectorBase<T, 4, Vec4<T>>
{
  public:
    using AVectorBase<T, 4, Vec4<T>>::AVectorBase;

    T x() const { return Vec4<T>::AVectorBase::m_elements[0]; }
    T y() const { return Vec4<T>::AVectorBase::m_elements[1]; }
    T z() const { return Vec4<T>::AVectorBase::m_elements[2]; }
    T w() const { return Vec4<T>::AVectorBase::m_elements[3]; }

    void setX(T x_val) { Vec4<T>::AVectorBase::m_elements[0] = x_val; }
    void setY(T y_val) { Vec4<T>::AVectorBase::m_elements[1] = y_val; }
    void setZ(T z_val) { Vec4<T>::AVectorBase::m_elements[2] = z_val; }
    void setW(T w_val) { Vec4<T>::AVectorBase::m_elements[3] = w_val; }
};

static_assert(std::is_trivial_v<Vec4<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Vec4<float>>, "standard layout required");

} // namespace JsUtil