#include "JsUtil/Vec2.h"

namespace JsUtil
{
template<typename T>
void Vec2<T>::Mat3Multiply(Mat3<T> & _mat, Vec2<T> & o_result)
{
    o_result.m_x = _mat.m_elements[0] * m_x + _mat.m_elements[3] * m_x + _mat.m_elements[6];
    o_result.m_y = _mat.m_elements[1] * m_y + _mat.m_elements[4] * m_y + _mat.m_elements[7];
}

template<typename T>
void Vec2<T>::Mat3Multiply(Mat3<T> & _mat3)
{
    Mat3Multiply(_mat3, *this);
}

template
struct Vec2<float>;
static_assert(std::is_pod<Vec2<float>>::value, "POD-ness broken...");

template
struct Vec2<double>;
} // namespace JsUtil