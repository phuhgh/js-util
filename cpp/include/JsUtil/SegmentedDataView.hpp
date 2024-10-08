#pragma once

#include "JsUtil/Debug.hpp"

#include <map>
#include <span>

namespace JsUtil
{

/**
* @brief Provides a non-owning view of a contiguous block of memory, much like how attributes are interpreted in opengl.
*/
template <typename TContainer>
class SegmentedDataView
{
  public:
    // imitate stl containers
    using value_type = typename TContainer::value_type;
    using size_type = typename TContainer::size_type;

    SegmentedDataView(TContainer& container, auto block_size)
        : m_container(container)
        , m_block_size(block_size)
        , m_stride(block_size)
        , m_offset(0)
    {
    }

    SegmentedDataView(TContainer& container, auto block_size, auto stride)
        : m_container(container)
        , m_block_size(block_size)
        , m_stride(stride)
        , m_offset(0)
    {
    }

    SegmentedDataView(TContainer& container, auto block_size, auto stride, auto offset)
        : m_container(container)
        , m_block_size(block_size)
        , m_stride(stride)
        , m_offset(offset)
    {
    }

    /// @returns A block, which contains one to many value_type.
    template <typename T = TContainer, std::enable_if_t<!std::is_const<T>::value, int> = 0>
    std::span<value_type> getBlock(size_type index)
    {
        size_type start = m_offset + index * m_stride;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_block_size <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type>(&m_container[start], m_block_size);
    }
    /// @returns A block, which contains one to many value_type.
    std::span<value_type const> getBlock(size_type index) const
    {
        size_type start = m_offset + index * m_stride;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_block_size <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type const>(&m_container[start], m_block_size);
    }
    /// @returns The number of value_type in a block.
    size_type getBlockSize() const { return m_block_size; }
    /// @returns The number of value_type between each block (equal to `getBlockSize` if tightly packed).
    size_type getStride() const { return m_stride; }
    /// @returns The number of value_type to skip at the start.
    size_type getOffset() const { return m_offset; }
    /// @returns The number total number of blocks. Rounded down if non integer.
    size_type getLength() const { return (m_container.size() - m_offset) / m_stride; }

  private:
    TContainer& m_container;
    size_type   m_block_size;
    size_type   m_stride;
    size_type   m_offset;
};

} // namespace JsUtil
