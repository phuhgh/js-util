#include "JsUtil/Vec3.h"

template
struct JsUtil::Vec3<float>;
static_assert(std::is_pod<JsUtil::Vec3<float>>::value, "POD-ness broken...");

template
struct JsUtil::Vec3<double>;
