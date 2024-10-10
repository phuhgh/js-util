#pragma once

#include "JsUtil/Debug.hpp"
#include <span>

namespace JsUtil
{

// todo jack: rename the file, how can we store the metadata (block size)? logically this sounds like a std::map
// problem, but then it's a question of how do we generate and store unique keys?
// so storing keys is easy, better question how to get back to them?
// centralized store, lookup by entity, then do lookups from there, based upon feature
// ok, so how do we generate keys?
// bonus points for: constexpr / static compatible (seems unlikely)
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
    {
    }

    /// @returns A block, which contains one to many value_type.
    template <typename T = TContainer, std::enable_if_t<!std::is_const<T>::value, int> = 0>
    std::span<value_type> getBlock(size_type index)
    {
        size_type start = index * m_block_size;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_block_size <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type>(&m_container[start], m_block_size);
    }
    /// @returns A block, which contains one to many value_type.
    std::span<value_type const> getBlock(size_type index) const
    {
        size_type start = index * m_block_size;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_block_size <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type const>(&m_container[start], m_block_size);
    }
    /// @returns The number of value_type in a block.
    size_type getBlockSize() const { return m_block_size; }
    /// @returns The number total number of blocks. Rounded down if non integer.
    size_type getLength() const { return m_container.size() / m_block_size; }

  private:
    TContainer& m_container;
    size_type      m_block_size;
};

} // namespace JsUtil
