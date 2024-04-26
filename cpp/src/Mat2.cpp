#include "JsUtil/Mat2.h"

namespace JsUtil
{
template <typename T> T Mat2<T>::GetVec2MultiplyX(T x)
{
    return m_elements[0] * x + m_elements[2];
}

template struct Mat2<float>;
static_assert(std::is_pod<Mat2<float>>::value, "POD-ness broken...");

template struct Mat2<double>;
} // namespace JsUtil