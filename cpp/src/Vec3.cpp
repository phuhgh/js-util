#include "JsUtil/Vec3.h"

namespace JsUtil
{
template struct Vec3<float>;
static_assert(std::is_pod<Vec3<float>>::value, "POD-ness broken...");

template struct Vec3<double>;
} // namespace JsUtil