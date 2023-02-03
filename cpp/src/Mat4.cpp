#include "JsUtil/Mat4.h"

template
struct JsUtil::Mat4<float>;
static_assert(std::is_pod<JsUtil::Mat4<float>>::value, "POD-ness broken...");

template
struct JsUtil::Mat4<double>;
