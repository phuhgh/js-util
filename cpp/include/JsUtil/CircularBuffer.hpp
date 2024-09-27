#pragma once

#include "JsUtil/ResizableArray.hpp"

namespace JsUtil
{

template <typename TValue, WithUnsigned TIndex = size_t>
class CircularBuffer
{
  public:
    explicit CircularBuffer(TIndex size)
        : m_array(size)
    {
    }

    CircularBuffer(std::initializer_list<TValue> const& values)
        : m_array(values)
    {
    }

    TIndex  getSize() const { return m_array.size(); }
    TValue  operator[](TIndex index) const { return m_array[getAdjustedIndex(index)]; }
    TValue& operator[](TIndex index) { return m_array[getAdjustedIndex(index)]; }

  private:
    ResizableArray<TValue, TIndex> m_array;

    TIndex getAdjustedIndex(TIndex index) const { return index % m_array.size(); }
};

} // namespace JsUtil