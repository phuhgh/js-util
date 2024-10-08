#include "JsUtil/IdFactory.hpp"
#include "JsUtil/Debug.hpp"
#include <atomic>

namespace JsUtil
{

std::uint32_t IdFactory::generateId()
{
    static std::atomic<std::uint32_t> counter{1};

    if constexpr (Debug::isDebug())
    {
        Debug::debugAssert(counter < std::numeric_limits<std::uint32_t>::max(), "ran out of address space");
    }

    return counter++;
}

} // namespace JsUtil