#include "JsUtil/Mat3.h"

namespace JsUtil
{
template
struct Mat3<float>;
static_assert(std::is_pod<Mat3<float>>::value, "POD-ness broken...");

template
struct Mat3<double>;
} // namespace JsUtil