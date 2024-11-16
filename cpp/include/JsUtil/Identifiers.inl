#pragma once

namespace JsUtil
{

template <WithUnsigned TNumber>
inline TNumber IdFactory<TNumber>::generateId() noexcept
{
    if constexpr (Debug::isDebug())
    {
        Debug::debugAssert(m_counter < std::numeric_limits<std::uint32_t>::max(), "ran out of address space");
    }

    return m_counter++;
}

} // namespace JsUtil
