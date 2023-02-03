#include "JsUtil/Mat3.h"

template
struct JsUtil::Mat3<float>;
static_assert(std::is_pod<JsUtil::Mat3<float>>::value, "POD-ness broken...");

template
struct JsUtil::Mat3<double>;
