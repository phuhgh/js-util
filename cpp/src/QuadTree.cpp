#include "JsUtilQuadTree/QuadTree.hpp"
#include "JsUtil/Debug.hpp"
#include "JsUtil/JsInterop.hpp"
#include <emscripten/em_macros.h>

/**
 * iteration state:
 * 0 - nothing checked
 * 1 - nw checked
 * 2 - nw, ne checked
 * 3 - nw, ne, se checked
 * 4 - node cleared
 *
 * scELEMENTS_PER_NODE is a power of 2, so we can use bitwise & to check this (instead of shifting with equals)
 **/
namespace JsUtilQuadTree
{

static std::array<QuadElement, QuadStore::scMAX_DEPTH * QuadNode::scELEMENTS_PER_NODE> sQUERY_ELEMENTS{};

// todo jack: vectorize this
/// Differs slightly from JsUtil::Range2d range checking, in that the upper bound is not inclusive.
bool isPointInRange(JsUtil::Range2d<uint16_t> _range, JsUtil::Vec2<uint16_t> _point)
{
    return _point.x() >= _range.xMin() && _point.x() < _range.xMax() && _point.y() >= _range.yMin() &&
           _point.y() < _range.yMax();
}

void QuadTree::setTopLevel(JsUtil::Range2d<uint16_t> _aabb, uint32_t maxDepth)
{
    JsUtil::Debug::runBlock([&] {
        auto copy = _aabb;
        copy.ensureAABB();
        JsUtil::Debug::debugAssert(copy == _aabb, "expected top level to be an AABB");
        JsUtil::Debug::debugAssert(maxDepth <= QuadStore::scMAX_DEPTH, "max depth must not exceed 12");
    });
    m_store.reset();
    m_maxDepthIndex = maxDepth - 1;
    m_bounds = _aabb;
}

uint32_t QuadTree::getTotalElementCount()
{
    std::uint32_t offset{0};
    std::uint64_t iterationState{0};
    std::uint32_t depth{0};
    std::uint32_t count{0};

    auto unwind = [&depth, &iterationState, &offset] {
        iterationState >>= 4;
        depth--;
        offset = offset / 4;
    };
    auto recurse = [&depth, &iterationState, &offset]() -> void {
        ++iterationState;
        iterationState <<= 4;
        ++depth;
        offset *= 4;
    };
    auto nextNode = [&iterationState, &offset] {
        ++iterationState;
        ++offset;
    };

    while (depth != std::numeric_limits<uint32_t>::max())
    {
        JsUtil::Debug::debugAssert((iterationState & 0xF) <= 4, "unexpected quadrant");

        if (static_cast<bool>(iterationState & 4))
        {
            // all quadrants were checked, return to the parent
            unwind();
        }
        else
        {
            auto* c_quad = m_store.getNode(offset, depth);

            if (c_quad != nullptr)
            {
                count += c_quad->count;

                if (c_quad->count == c_quad->elements.size() && depth < m_maxDepthIndex)
                {
                    // node is full, possibly there are children filled too
                    recurse();
                }
                else
                {
                    // the node wasn't full, no children are populated
                    nextNode();
                }
            }
            else
            {
                nextNode();
            }
        }
    }

    return count;
}

void QuadTree::insertRange(JsUtil::Range2d<uint16_t> _aabb, QuadElement _element, QuadAllocator* o_allocator)
{
    std::uint32_t offset{0};

    std::uint64_t                             iterationState{0};
    std::uint32_t                             depth{0};
    std::array<JsUtil::Range2d<uint16_t>, 12> ranges{};
    ranges[0] = m_bounds;

    auto unwind = [&depth, &iterationState, &offset] {
        iterationState >>= 4;
        depth--;
        offset = offset / 4;
    };
    auto recurse = [&depth, &iterationState, &offset, &ranges](JsUtil::Range2d<uint16_t> range) -> void {
        ++iterationState;
        iterationState <<= 4;
        ++depth;
        offset *= 4;
        ranges[depth] = range;
    };
    auto nextNode = [&iterationState, &offset] {
        ++iterationState;
        ++offset;
    };

    while (depth != std::numeric_limits<std::uint32_t>::max())
    {
        std::uint8_t const nodeState = iterationState & 0xF;
        JsUtil::Debug::debugAssert(nodeState <= 4, "unexpected quadrant");

        if (nodeState == 4)
        {
            // all quadrants were checked, return to the parent
            unwind();
            continue;
        }

        // there are still some quadrants to check
        auto range = ranges[depth].getQuad(static_cast<JsUtil::EQuadrant>(nodeState));
        if (!range.rangeIntersects(_aabb))
        {
            nextNode();
            continue;
        }

        auto* c_quad = m_store.ensureNodeAllocated(offset, depth, o_allocator);

        if (c_quad == nullptr)
        {
            nextNode();
        }
        else if (c_quad->count < QuadNode::scELEMENTS_PER_NODE)
        {
            // there's space, add it here
            c_quad->pushElement(_element);
            nextNode();
        }
        else if (depth < m_maxDepthIndex)
        {
            // we're in the right place, but this node is full, try the children
            recurse(range);
        }
        else
        {
            // depth does not allow recursion, continue with siblings
            nextNode();
        }
    }
}

uint32_t QuadTree::queryPoint(JsUtil::Vec2<uint16_t> _point, std::span<QuadElement> o_elements)
{
    std::uint32_t                             offset{0};
    std::uint32_t                             count{0};
    std::uint64_t                             iterationState{0};
    std::uint32_t                             depth{0};
    std::array<JsUtil::Range2d<uint16_t>, 12> ranges{};
    ranges[0] = m_bounds;

    auto recurse = [&depth, &iterationState, &offset, &ranges](JsUtil::Range2d<uint16_t> range) -> void {
        if constexpr (JsUtil::Debug::isDebug())
        {
            JsUtil::Debug::debugAssert(depth < 11, "overflowing depth");
        }
        ++iterationState;
        iterationState <<= 4;
        ++depth;
        offset *= 4;
        ranges[depth] = range;
    };
    auto nextNode = [&iterationState, &offset] {
        ++iterationState;
        ++offset;
    };

    while (depth <= m_maxDepthIndex)
    {
        std::uint8_t const nodeState = iterationState & 0xF;
        JsUtil::Debug::debugAssert(nodeState <= 4, "unexpected quadrant");

        if (nodeState == 4)
        {
            // all quadrants were checked, we're done
            break;
        }

        // there are still some quadrants to check
        auto range = ranges[depth].getQuad(static_cast<JsUtil::EQuadrant>(nodeState));
        if (!isPointInRange(range, _point))
        {
            nextNode();
            continue;
        }

        auto* c_quad = m_store.getNode(offset, depth);

        if (c_quad == nullptr)
        {
            break;
        }

        for (auto const& element : c_quad->getPopulatedElements())
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::debugAssert(count < o_elements.size(), "overflow of element buffer");
            }
            o_elements[count++] = element;
        }

        if (c_quad->count == QuadNode::scELEMENTS_PER_NODE)
        {
            recurse(range);
        }
        else
        {
            break;
        }
    }

    return count;
}

} // namespace JsUtilQuadTree

extern "C"
{
    // todo jack: isn't the convention for camel case?
    using namespace JsUtilQuadTree;
    EMSCRIPTEN_KEEPALIVE
    gsl::owner<JsInterop::SharedMemoryOwner<QuadTree>*> QuadTree_createTree()
    {
        JsUtil::Debug::onBeforeAllocate();
        return dynamic_cast<gsl::owner<JsInterop::SharedMemoryOwner<QuadTree>*>>(
            JsInterop::createSharedMemoryOwner(new (std::nothrow) QuadTree{}, {})
        );
    }

    EMSCRIPTEN_KEEPALIVE
    void QuadTree_setTopLevel(JsInterop::SharedMemoryOwner<QuadTree>* _tree, JsUtil::Range2d<uint16_t> const* _range)
    {
        // todo jack: we could just set the depth from the JS, don't see any reason why not?
        _tree->m_owningPtr->setTopLevel(*_range);
    }

    EMSCRIPTEN_KEEPALIVE
    uint32_t QuadTree_queryPoint(JsInterop::SharedMemoryOwner<QuadTree>* _tree, uint16_t _pointX, uint16_t _pointY)
    {
        return _tree->m_owningPtr->queryPoint(
            JsUtil::Vec2<uint16_t>{{_pointX, _pointY}}, std::span<QuadElement>{sQUERY_ELEMENTS}
        );
    }

    EMSCRIPTEN_KEEPALIVE
    gsl::owner<JsInterop::SharedMemoryOwner<QuadAllocator>*> QuadTree_createAllocator()
    {
        return dynamic_cast<gsl::owner<JsInterop::SharedMemoryOwner<QuadAllocator>*>>(
            JsInterop::createSharedMemoryOwner(new (std::nothrow) QuadAllocator{}, {})
        );
    }

    EMSCRIPTEN_KEEPALIVE
    void QuadTree_insertRange(
        JsInterop::SharedMemoryOwner<QuadTree>*      _tree,
        JsInterop::SharedMemoryOwner<QuadAllocator>* o_allocator,
        JsUtil::Range2d<uint16_t> const*             _range,
        QuadElement const*                           _quadElement
    )
    {
        _tree->m_owningPtr->insertRange(*_range, QuadElement{*_quadElement}, o_allocator->m_owningPtr.get());
    }

    EMSCRIPTEN_KEEPALIVE
    uint32_t quadTree_getQuadElementCount(JsInterop::SharedMemoryOwner<QuadTree>* _tree)
    {
        return _tree->m_owningPtr->getTotalElementCount();
    }

    EMSCRIPTEN_KEEPALIVE
    QuadElement* quadTree_getResultAddress()
    {
        return sQUERY_ELEMENTS.data();
    }
}
