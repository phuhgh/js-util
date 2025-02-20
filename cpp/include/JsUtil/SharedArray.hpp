#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/JsInterop.hpp"
#include <gsl/pointers>
#include <span>

namespace JsUtil
{

template <typename TValue>
class SharedArray
{
  public:
    // imitate stl containers
    using value_type = TValue;
    using size_type = size_t;

    ~SharedArray() { free(m_view.data()); }

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

    static SharedArray createOne(size_t size, bool clearMemory) noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }

        return SharedArray{
            static_cast<gsl::owner<TValue*>>(
                clearMemory ? std::calloc(size, sizeof(TValue)) : std::malloc(size * sizeof(TValue))
            ),
            size
        };
    }

    std::span<TValue> asSpan() const noexcept { return m_view; }
    operator std::span<TValue>() const noexcept { return asSpan(); }
    size_t size() const noexcept { return m_view.size(); }

    TValue*       data() noexcept { return m_view.data(); }
    TValue const* data() const noexcept { return m_view.data(); }

    TValue const& operator[](size_t index) const noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(index < m_view.size(), "index out of bounds");
        }
        return m_view[index];
    }
    TValue& operator[](size_t index) noexcept
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(index < m_view.size(), "index out of bounds");
        }
        return m_view[index];
    }

  private:
    explicit SharedArray(TValue* _arrayStart, size_t _size)
        : m_view(_arrayStart, _size)
    {
    }

    std::span<TValue> m_view;
};

} // namespace JsUtil
