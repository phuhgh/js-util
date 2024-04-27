#include "JsUtil/Mat3.h"

static_assert(std::is_trivial_v<JsUtil::Mat3<float>>, "trivial required");
static_assert(std::is_standard_layout_v<JsUtil::Mat3<float>>, "standard layout required");