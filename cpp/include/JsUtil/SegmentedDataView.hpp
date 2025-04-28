#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/TypeTraits.hpp"
#include <map>
#include <span>

namespace JsUtil
{

// todo jack2: binding for this
struct SegmentedDataViewOptions
{
    uint8_t blockSize{1};
    uint8_t stride{blockSize};
    uint8_t offset{0};
};

struct ISegmentedDataView
{
    virtual ~ISegmentedDataView() = default;
    virtual SegmentedDataViewOptions getOptions() const = 0;
};

/**
 * @brief Provides a non-owning view of a contiguous block of memory, much like how attributes are interpreted in
 * opengl.
 * @remark It's possible for the stride to be smaller than the block size (unlike opengl).
 */
template <typename TContainer>
class SegmentedDataView : public ISegmentedDataView
{
  public:
    // imitate stl containers
    using value_type = typename TContainer::value_type;
    using size_type = typename TContainer::size_type;

    ~SegmentedDataView() = default;
    SegmentedDataView(TContainer& container, SegmentedDataViewOptions options)
        : m_container(container)
        , m_options(options)
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(m_options.blockSize > 0, "invalid block size");
            Debug::debugAssert(m_options.stride > 0, "invalid stride size");
        }
    }

    // from ISegmentedDataView
    SegmentedDataViewOptions getOptions() const override { return m_options; }

    template <typename TCallback>
    auto mapBlock(size_type index, TCallback callback) const
    {
        return callback(getBlock(index), m_options);
    }

    /// @returns A block, which contains one or more value_type.
    template <typename T = TContainer, std::enable_if_t<!std::is_const<T>::value, int> = 0>
    std::span<value_type> getBlock(size_type index)
    {
        size_type start = m_options.offset + index * m_options.stride;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_options.blockSize <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type>(m_container.data() + start, m_options.blockSize);
    }
    /// @returns A block, which contains one or more value_type.
    std::span<value_type const> getBlock(size_type index) const
    {
        size_type start = m_options.offset + index * m_options.stride;
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(start + m_options.blockSize <= m_container.size(), "index out of bounds");
        }

        return std::span<value_type const>(m_container.data() + start, m_options.blockSize);
    }

    /// @returns The number total number of complete blocks.
    size_type getLength() const
    {
        auto size = m_container.size();
        if (m_options.blockSize + m_options.offset > size)
        {
            return 0;
        }

        auto overhang = m_options.blockSize > m_options.stride ? m_options.blockSize - m_options.stride : 0;
        return (size - m_options.offset - overhang) / m_options.stride;
    }

  private:
    TContainer&              m_container;
    SegmentedDataViewOptions m_options;
};

} // namespace JsUtil
