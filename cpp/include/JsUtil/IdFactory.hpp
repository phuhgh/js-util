#pragma once

#include <cstdint>

namespace JsUtil
{

/// Provides unique numbers in a way which is safe statically across translation units.
class IdFactory
{
  public:
    static std::uint32_t generateId();
};

} // namespace JsUtil
