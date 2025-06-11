#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/Range2d.hpp"
#include "JsUtil/TypeTraits.hpp"
#include <array>
#include <cstdint>
#include <span>

// todo jack: namespace no longer consistent
namespace JsUtilQuadTree
{

struct QuadElement
{
    // entity identifier
    std::uint16_t elementId;
    // segment id (connector specific)
    std::uint16_t dataId;

    // we don't actually support 64 bit indexes
    template <JsUtil::WithUnsigned T>
    static std::uint16_t idFromIndex(T index)
    {
        static_assert(!std::is_same_v<T, std::uint64_t>, "a maximum of 32 bit index is supported...");
        if constexpr (std::is_same_v<T, std::uint32_t>)
        {
            // todo jack: definitely unit test this
            return static_cast<std::uint16_t>(index / 65536);
        }
        else
        {
            return index;
        }
    }
};

struct QuadNode
{
    static constexpr uint32_t                    scELEMENTS_PER_NODE = 2;
    std::array<QuadElement, scELEMENTS_PER_NODE> elements{};
    // todo jack: can we have this be packed somewhere else? we only need 2 bits per node
    uint8_t                      count{0};
    void                         pushElement(QuadElement element) { elements[count++] = element; }
    std::span<QuadElement const> getPopulatedElements() const { return {elements.data(), count}; }
};

} // namespace JsUtilQuadTree
