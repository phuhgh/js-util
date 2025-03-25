#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/TypeTraits.hpp"
#include <gsl/pointers>
#include <span>
#include <type_traits>

namespace JsUtil
{

template <typename TValue, WithUnsigned TIndex = std::uint32_t>
    requires std::is_trivial_v<TValue>
class SharedArray
{
  public:
    // imitate stl containers
    using value_type = TValue;
    using size_type = TIndex;

    ~SharedArray()
    {
        std::destroy(m_view.begin(), m_view.end());
        free(m_view.data());
    }

    // allow move
    SharedArray(SharedArray&& other) noexcept
    {
        m_view = other.m_view;
        other.m_view = {};
    }
    SharedArray& operator=(SharedArray&& other) noexcept
    {
        if (this != &other)
        {
            m_view = other.m_view;
            other.m_view = {};
        }
        return *this;
    }

    // but not copy
    SharedArray(SharedArray const&) = delete;
    SharedArray& operator=(SharedArray const&) = delete;

    SharedArray(TIndex size, bool clearMemory = true) noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }

        TValue* arrayStart = static_cast<gsl::owner<TValue*>>(
            clearMemory ? std::calloc(size, sizeof(TValue)) : std::malloc(size * sizeof(TValue))
        );
        if (arrayStart == nullptr)
        {
            size = 0;
        }
        else
        {
            std::uninitialized_default_construct_n(arrayStart, size);
        }

        m_view = std::span<TValue>(arrayStart, size);
    }

    SharedArray(std::initializer_list<TValue> initList, bool clearMemory = true) noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }

        TIndex  size = initList.size();
        TValue* arrayStart = static_cast<gsl::owner<TValue*>>(
            clearMemory ? std::calloc(size, sizeof(TValue)) : std::malloc(size * sizeof(TValue))
        );
        if (arrayStart == nullptr)
        {
            size = 0;
        }
        else
        {
            std::uninitialized_copy(initList.begin(), initList.end(), arrayStart);
        }

        m_view = std::span<TValue>(arrayStart, size);
    }

    std::span<TValue> asSpan() const noexcept { return m_view; }
    operator std::span<TValue>() const noexcept { return asSpan(); }
    TIndex size() const noexcept { return m_view.size(); }

    TValue*       data() noexcept { return m_view.data(); }
    TValue const* data() const noexcept { return m_view.data(); }

    TValue const& operator[](TIndex index) const noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(index < m_view.size(), "index out of bounds");
        }
        return m_view[index];
    }
    TValue& operator[](TIndex index) noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(index < m_view.size(), "index out of bounds");
        }
        return m_view[index];
    }

  private:
    explicit SharedArray(TValue* _arrayStart, TIndex _size)
        : m_view(_arrayStart, _size)
    {
    }

    std::span<TValue> m_view;
};

} // namespace JsUtil
