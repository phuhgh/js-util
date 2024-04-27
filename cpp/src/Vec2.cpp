#include "JsUtil/Vec2.h"

static_assert(std::is_trivial_v<JsUtil::Vec2<float>>, "trivial required");
static_assert(std::is_standard_layout_v<JsUtil::Vec2<float>>, "standard layout required");
