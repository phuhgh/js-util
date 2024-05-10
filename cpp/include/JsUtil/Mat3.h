#pragma once

#include "JsUtil/Impl/VectorBase.h"

namespace JsUtil
{

template <typename T> class Mat3: public AVectorBase<T, 9, Mat3<T>>
{
  public:
    using AVectorBase<T, 9, Mat3<T>>::AVectorBase;
};

static_assert(std::is_trivial_v<Mat3<float>>, "trivial required");
static_assert(std::is_standard_layout_v<Mat3<float>>, "standard layout required");

} // namespace JsUtil