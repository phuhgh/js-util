#pragma once

#include "JsUtil/Impl/VectorBase.h"

namespace JsUtil
{

template <typename T>
class Mat2 : public AVectorBase<T, 4, Mat2<T>>
{
  public:
    using AVectorBase<T, 4, Mat2<T>>::AVectorBase;

    /// Get the x component of a multiplication with a Vec2
    T multiplyXComponent(T _xComponent) const
    {
        return Mat2<T>::AVectorBase::m_elements[0] * _xComponent + Mat2<T>::AVectorBase::m_elements[2];
    }
};

static_assert(std::is_trivial_v<Mat2<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Mat2<float>>, "standard layout required");

} // namespace JsUtil