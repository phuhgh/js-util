#include "Vec2.h"

template<typename T>
void JsUtil::Vec2<T>::Mat3Multiply(Mat3<T> & _mat, Vec2<T> & o_result)
{
    o_result.m_x = _mat.m_elements[0] * m_x + _mat.m_elements[3] * m_x + _mat.m_elements[6];
    o_result.m_y = _mat.m_elements[1] * m_y + _mat.m_elements[4] * m_y + _mat.m_elements[7];
}

template<typename T>
void JsUtil::Vec2<T>::Mat3Multiply(JsUtil::Mat3<T> & _mat3)
{
    Mat3Multiply(_mat3, *this);
}

template
struct JsUtil::Vec2<float>;
static_assert(std::is_pod<JsUtil::Vec2<float>>::value, "POD-ness broken...");

template
struct JsUtil::Vec2<double>;