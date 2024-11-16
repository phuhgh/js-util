#pragma once

#include "JsUtil/ResizableArray.hpp"

namespace JsUtil
{

template <typename TValue, WithUnsigned TIndex = size_t>
class CircularBuffer
{
  public:
    // noexcept if TValue is also noexcept
    explicit CircularBuffer(TIndex size)
        : m_array(size)
    {
    }

    CircularBuffer(std::initializer_list<TValue> const& values)
        : m_array(values)
    {
    }

    TIndex  getSize() const noexcept { return m_array.size(); }
    TValue  operator[](TIndex index) const noexcept { return m_array[getAdjustedIndex(index)]; }
    TValue& operator[](TIndex index) noexcept { return m_array[getAdjustedIndex(index)]; }

  private:
    TIndex getAdjustedIndex(TIndex index) const noexcept { return index % m_array.size(); }

    ResizableArray<TValue, TIndex> m_array;
};

} // namespace JsUtil