#include "Vec4.h"

template
struct JsUtil::Vec4<float>;
static_assert(std::is_pod<JsUtil::Vec4<float>>::value, "POD-ness broken...");

template
struct JsUtil::Vec4<double>;
