#pragma once

#include "JsUtil/Debug.hpp"
#include <span>

namespace JsUtil
{
template <typename T>
class SharedArray
{
  public:
    // imitate stl containers
    using value_type = T;

    static SharedArray* createOne(size_t _size, bool _clearMemory);
    ~                   SharedArray() { free(m_view.data()); }

    std::span<T> asSpan() const { return m_view; }
    operator std::span<T>() const { return asSpan(); }

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