#pragma once

#include "JsUtil/Debug.h"
#include <span>

namespace JsUtil
{
template <typename T>
class SharedArray
{
  public:
    static SharedArray* createOne(size_t _size, bool _clearMemory);
    std::span<T>        getArray() const { return m_view; }
    ~SharedArray() { free(m_view.data()); }

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