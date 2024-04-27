#include "JsUtil/Mat2.h"

static_assert(std::is_trivial_v<JsUtil::Mat2<float>>, "trivial required");
static_assert(std::is_standard_layout_v<JsUtil::Mat2<float>>, "standard layout required");