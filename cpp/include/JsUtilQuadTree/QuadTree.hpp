#pragma once

#include "JsUtilQuadTree/QuadNode.hpp"
#include "JsUtilQuadTree/QuadStore.hpp"
#include <array>
#include <cstdint>
#include <span>
#include <wasm_simd128.h>

namespace JsUtilQuadTree
{

inline std::array<JsUtil::Range2d<uint16_t>, 4> getQuads(JsUtil::Range2d<uint16_t> node);

class QuadTree
{
  public:
    void setTopLevel(JsUtil::Range2d<uint16_t> _aabb, uint32_t maxDepth = 12);
    void insertRange(JsUtil::Range2d<uint16_t> _aabb, QuadElement _element, QuadAllocator* o_allocator);

    std::uint32_t    queryPoint(JsUtil::Vec2<uint16_t> _point, std::span<QuadElement> o_elements);
    std::uint32_t    getTotalElementCount();
    QuadStore const& getStore() const noexcept { return m_store; }
    uint8_t          getMaxDepth() const noexcept { return m_maxDepthIndex + 1; }

  private:
    uint8_t                   m_maxDepthIndex{11};
    QuadStore                 m_store;
    JsUtil::Range2d<uint16_t> m_bounds{};
};

} // namespace JsUtilQuadTree

#include "JsUtilQuadTree/QuadTree.inl"
