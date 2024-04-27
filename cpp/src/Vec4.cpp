#include "JsUtil/Vec4.h"

static_assert(std::is_trivial_v<JsUtil::Vec4<float>>, "trivial required");
static_assert(std::is_standard_layout_v<JsUtil::Vec4<float>>, "standard layout required");
