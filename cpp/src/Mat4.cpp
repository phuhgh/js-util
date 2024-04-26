#include "JsUtil/Mat4.h"

namespace JsUtil
{
template struct Mat4<float>;
static_assert(std::is_pod<Mat4<float>>::value, "POD-ness broken...");

template struct Mat4<double>;
} // namespace JsUtil