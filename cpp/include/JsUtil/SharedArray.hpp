#pragma once

#include "JsUtil/Debug.hpp"
#include <gsl/pointers>
#include <span>

namespace JsUtil
{
template <typename T>
class SharedArray
{
  public:
    // imitate stl containers
    using value_type = T;
    using size_type = size_t;

    ~SharedArray() { free(m_view.data()); }

    static gsl::owner<SharedArray*> createOne(size_t _size, bool _clearMemory)
    {
        if constexpr (Debug::isDebug())
        {
            Debug::onBeforeAllocate();
        }
        // ReSharper disable CppDFAMemoryLeak
        auto arrayPtr = _clearMemory ? static_cast<gsl::owner<T*>>(calloc(_size, sizeof(T)))
                                     : static_cast<gsl::owner<T*>>(malloc(_size * sizeof(T)));
        // ReSharper restore CppDFAMemoryLeak

        if (arrayPtr == nullptr)
        {
            // allocation failed
            // ReSharper disable once CppDFAMemoryLeak - ^ it's null -> no leak
            return nullptr;
        }

        auto shared_array = new (std::nothrow) SharedArray<T>(arrayPtr, _size);

        if (shared_array == nullptr)
        {
            free(arrayPtr);
            return nullptr;
        }

        // ReSharper disable once CppDFAMemoryLeak
        return shared_array;
    }

    std::span<T> asSpan() const { return m_view; }
    operator std::span<T>() const { return asSpan(); }
    size_t size() const { return m_view.size(); }

    T operator[](size_t index) const
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(index < m_view.size(), "index out of bounds");
        }
        return m_view[index];
    }
    T& operator[](size_t index)
    {
        if constexpr (Debug::isDebug())
        {
            Debug::debugAssert(index < m_view.size(), "index out of bounds");
        }
        return m_view[index];
    }

  private:
    explicit SharedArray(T* _arrayStart, size_t _size)
        : m_view(_arrayStart, _size)
    {
    }
                 SharedArray(SharedArray&&) = delete;
    SharedArray& operator=(SharedArray&&) = delete;
    SharedArray& operator=(SharedArray const&) = delete;
                 SharedArray(SharedArray const&) = delete;

    std::span<T> m_view;
};
} // namespace JsUtil