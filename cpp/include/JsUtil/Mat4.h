#pragma once

#include "JsUtil/Impl/VectorBase.h"

namespace JsUtil
{

template <typename T> class Mat4 : public AVectorBase<T, 16, Mat4<T>>
{
  public:
    using AVectorBase<T, 16, Mat4<T>>::AVectorBase;
};

static_assert(std::is_trivial_v<JsUtil::Mat4<float>>, "trivial required");
static_assert(std::is_standard_layout_v<JsUtil::Mat4<float>>, "standard layout required");

} // namespace JsUtil