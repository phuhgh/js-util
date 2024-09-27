#pragma once

#include "JsUtil/Impl/VectorBase.hpp"

namespace JsUtil
{

template <typename T>
class Vec3 : public AVectorBase<T, 3, Vec3<T>>
{
  public:
    using AVectorBase<T, 3, Vec3<T>>::AVectorBase;

    T x() const { return Vec3<T>::AVectorBase::m_elements[0]; };
    T y() const { return Vec3<T>::AVectorBase::m_elements[1]; };
    T z() const { return Vec3<T>::AVectorBase::m_elements[2]; };

    void setX(T x_val) { Vec3<T>::AVectorBase::m_elements[0] = x_val; }
    void setY(T y_val) { Vec3<T>::AVectorBase::m_elements[1] = y_val; }
    void setZ(T z_val) { Vec3<T>::AVectorBase::m_elements[2] = z_val; }
};

static_assert(std::is_trivial_v<Vec3<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Vec3<float>>, "standard layout required");

} // namespace JsUtil