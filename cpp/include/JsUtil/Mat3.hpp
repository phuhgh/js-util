#pragma once

#include "JsUtil/Impl/VectorBase.hpp"

namespace JsUtil
{

template <typename T>
class Mat3 : public AVectorBase<T, 9, Mat3<T>>
{
  public:
    using AVectorBase<T, 9, Mat3<T>>::AVectorBase;

    Mat3& setIdentityMatrix()
    {
        this->m_elements.fill(T(0));
        this->m_elements[0] = T(1);
        this->m_elements[4] = T(1);
        this->m_elements[8] = T(1);

        return *this;
    }

    Mat3& setScalingMatrix(T scalingFactorX, T scalingFactorY)
    {
        this->m_elements[0] = scalingFactorX;
        this->m_elements[1] = T(0);
        this->m_elements[2] = T(0);
        this->m_elements[3] = T(0);
        this->m_elements[4] = scalingFactorY;
        this->m_elements[5] = T(0);
        this->m_elements[6] = T(0);
        this->m_elements[7] = T(0);
        this->m_elements[8] = T(1);

        return *this;
    }
};

static_assert(std::is_trivial_v<Mat3<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Mat3<float>>, "standard layout required");

} // namespace JsUtil