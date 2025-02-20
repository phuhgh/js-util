#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/TypeTraits.hpp"
#include <map>
#include <span>

namespace JsUtil
{

template <WithUnsigned TIndex>
struct SegmentedDataViewOptions
{
    TIndex blockSize{1};
    TIndex stride{blockSize};
    TIndex offset{0};
};

template <WithUnsigned TIndex>
struct ISegmentedDataView
{
    virtual ~ISegmentedDataView() = default;
    virtual SegmentedDataViewOptions<TIndex> getOptions() const = 0;
};

/**
 * @brief Provides a non-owning view of a contiguous block of memory, much like how attributes are interpreted in
 * opengl.
 */
template <typename TContainer>
class SegmentedDataView : public ISegmentedDataView<typename TContainer::size_type>
{
  public:
    // imitate stl containers
    using value_type = typename TContainer::value_type;
    using size_type = typename TContainer::size_type;

    ~SegmentedDataView() = default;
    SegmentedDataView(TContainer& container, SegmentedDataViewOptions<size_type> options)
        : m_container(container)
        , m_options(options)
    {
    }

    // from ISegmentedDataView
    SegmentedDataViewOptions<size_type> getOptions() const override { return m_options; }

    /// @returns A block, which contains one or more value_type.
    template <typename T = TContainer, std::enable_if_t<!std::is_const<T>::value, int> = 0>
    std::span<value_type> getBlock(size_type index)
    {
        size_type start = m_options.offset + index * m_options.stride;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_options.blockSize <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type>(&m_container[start], m_options.blockSize);
    }
    /// @returns A block, which contains one or more value_type.
    std::span<value_type const> getBlock(size_type index) const
    {
        size_type start = m_options.offset + index * m_options.stride;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_options.blockSize <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type const>(&m_container[start], m_options.blockSize);
    }
    /// @returns The number of value_type in a block.
    size_type getBlockSize() const { return m_options.blockSize; }
    /// @returns The number of value_type between each block (equal to `getBlockSize` if tightly packed).
    size_type getStride() const { return m_options.stride; }
    /// @returns The number of value_type to skip at the start.
    size_type getOffset() const { return m_options.offset; }
    /// @returns The number total number of blocks. Rounded down if non integer.
    size_type getLength() const { return (m_container.size() - m_options.offset) / m_options.stride; }

  private:
    TContainer&                         m_container;
    SegmentedDataViewOptions<size_type> m_options;
};

template <typename TContainer>
SegmentedDataView(TContainer&, SegmentedDataViewOptions<typename std::decay_t<TContainer>::value_type>)
    -> SegmentedDataView<TContainer>;

} // namespace JsUtil
