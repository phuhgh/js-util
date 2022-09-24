#include "Mat2.h"

template<typename T>
T JsUtil::Mat2<T>::GetVec2MultiplyX(T x)
{
    return m_elements[0] * x + m_elements[2];
}

template
struct JsUtil::Mat2<float>;
static_assert(std::is_pod<JsUtil::Mat2<float>>::value, "POD-ness broken...");

template
struct JsUtil::Mat2<double>;
