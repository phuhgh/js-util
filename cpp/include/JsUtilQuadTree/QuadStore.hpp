#pragma once

#include "JsUtil/ResizableArray.hpp"
#include "JsUtilQuadTree/QuadNode.hpp"
#include <array>
#include <cstdint>

namespace JsUtilQuadTree
{

/**
 * @brief An allocator for dynamically created quad nodes, for use with a single thread / subtree.
 * @remarks Not threadsafe if sharing happens between threads.
 */
class QuadAllocator
{
  public:
    using TBlock = std::array<QuadNode, 65536>;

    QuadAllocator() = default;
    QuadAllocator(QuadAllocator const&) = delete;
    QuadAllocator& operator=(QuadAllocator const&) = delete;
    QuadAllocator(QuadAllocator&&) = delete;
    QuadAllocator& operator=(QuadAllocator&&) = delete;
    ~QuadAllocator()
    {
        for (auto block : m_blocks)
        {
            delete block;
        }
    }

    TBlock* allocateBlock() noexcept
    {
        if (m_index < m_allocatedBlocks)
        {
            return m_blocks[m_index++];
        }
        else if (m_index < m_blocks.size())
        {
            auto* block = m_blocks[m_index] = new (std::nothrow) TBlock{};
            if (block != nullptr)
            {
                m_index++;
                m_allocatedBlocks++;
            }
            return block;
        }
        else
        {
            return nullptr;
        }
    }

    void reset() { m_index = 0; }

  private:
    std::array<gsl::owner<TBlock*>, 128> m_blocks{nullptr};
    std::uint32_t                        m_allocatedBlocks{0};
    std::uint32_t                        m_index{0};
};

class QuadStore
{
  public:
    static constexpr uint32_t scMAX_DEPTH = 12;

    /// @brief If the node has been allocated already, return it, otherwise attempt to allocate.
    QuadNode* ensureNodeAllocated(std::uint32_t offset, std::uint32_t depth, QuadAllocator* o_allocator)
    {
        if (depth < 8) // 0 - 7
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::debugAssert(offset < m_preallocated[depth].size(), "index out of bounds");
            }
            return &m_preallocated[depth][offset];
        }
        else // 8 - 11
        {
            if constexpr (JsUtil::Debug::isDebug())
            {
                JsUtil::Debug::debugAssert(
                    offset < m_dynamicallyAllocated[depth - 8].size() * 65536, "index out of bounds"
                );
            }

            auto  blockIndex = offset / 65536;
            auto  blockLevels = m_dynamicallyAllocated[depth - 8];
            auto* c_block = blockLevels[blockIndex];

            if (c_block == nullptr)
            {
                c_block = blockLevels[blockIndex] = o_allocator->allocateBlock();

                if (c_block == nullptr)
                {
                    // probably OOM, bail
                    return nullptr;
                }
            }
            auto nodeIndex = offset % 65536;
            return &c_block->operator[](nodeIndex);
        }
    }

    /// @returns The node, if it was allocated, else nullptr.
    QuadNode* getNode(std::uint32_t offset, std::uint32_t depth)
    {
        if (depth < 8) // 0 - 7
        {
            return &m_preallocated[depth][offset];
        }
        else // 8 - 11
        {
            auto blockIndex = offset / 65536;

            auto  blockLevels = m_dynamicallyAllocated[depth - 8];
            auto* c_block = blockLevels[blockIndex];

            if (c_block == nullptr)
            {
                return nullptr;
            }
            return &c_block->operator[](offset % 65536);
        }
    }

    void reset()
    {
        for (auto& row : m_preallocated)
        {
            std::fill(row.begin(), row.end(), QuadNode{});
        }

        for (auto& row : m_dynamicallyAllocated)
        {
            for (auto& block : row)
            {
                if (block != nullptr)
                {
                    std::fill(block->begin(), block->end(), QuadNode{});
                    block = nullptr;
                }
            }
        }
    }

  private:
    // ensure 128 bit alignment to avoid false sharing
    alignas(128) std::array<QuadNode, 4> m_r1{};
    alignas(128) std::array<QuadNode, 16> m_r2{};
    alignas(128) std::array<QuadNode, 64> m_r3{};
    alignas(128) std::array<QuadNode, 256> m_r4{};
    alignas(128) std::array<QuadNode, 1024> m_r5{};
    alignas(128) std::array<QuadNode, 4096> m_r6{};
    alignas(128) std::array<QuadNode, 16384> m_r7{};
    alignas(128) std::array<QuadNode, 65536> m_r8{};
    alignas(128) std::array<std::span<QuadNode>, 8> m_preallocated{
        m_r1,
        m_r2,
        m_r3,
        m_r4,
        m_r5,
        m_r6,
        m_r7,
        m_r8,
    };

    // there are 4 indexing threads, each getting (up to) 1, 4, 16 or 64 blocks with no sharing
    alignas(128) std::array<QuadAllocator::TBlock*, 4> m_r9{};
    alignas(128) std::array<QuadAllocator::TBlock*, 16> m_r10{};
    alignas(128) std::array<QuadAllocator::TBlock*, 64> m_r11{};
    alignas(128) std::array<QuadAllocator::TBlock*, 256> m_r12{};

    std::array<std::span<QuadAllocator::TBlock*>, 4> m_dynamicallyAllocated{m_r9, m_r10, m_r11, m_r12};
};

} // namespace JsUtilQuadTree
