#include "JsUtil/Vec3.h"

static_assert(std::is_trivial_v<JsUtil::Vec3<float>>, "trivial required");
static_assert(std::is_standard_layout_v<JsUtil::Vec3<float>>, "standard layout required");
