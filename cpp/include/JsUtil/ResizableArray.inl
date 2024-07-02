#pragma once

namespace JsUtil
{

template <typename TValue, IsUnsigned TIndex> ResizableArray<TValue, TIndex>::~ResizableArray()
{
    deleteArray();
}

template <typename TValue, IsUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(TIndex size)
    : m_size(size)
    , m_values(allocateArray(size))
{
    if (m_values == nullptr)
    {
        // the allocation failed, make safe
        m_size = 0;
    }
    else
    {
        for (TIndex i = 0; i < size; ++i)
        {
            new (m_values + i) TValue();
        }
    }
}

template <typename TValue, IsUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(std::initializer_list<TValue> const& values)
    : m_size(values.size())
    , m_values(allocateArray(values.size()))
{
    if (m_values == nullptr)
    {
        // the allocation failed, make safe
        m_size = 0;
    }
    else
    {
        moveArrayValues(values);
    }
}

template <typename TValue, IsUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(ResizableArray const& other)
    : m_size(other.m_size)
    , m_values(allocateArray(other.size()))
{
    if (m_values == nullptr)
    {
        // the allocation failed, make safe
        m_size = 0;
    }
    else
    {
        copyArrayValues(other);
    }
}

template <typename TValue, IsUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(ResizableArray&& other) noexcept
    : m_size(other.m_size)
    , m_values(other.m_values)
{
    other.m_size = 0;
    other.m_values = nullptr;
}

template <typename TValue, IsUnsigned TIndex>
ResizableArray<TValue, TIndex>& ResizableArray<TValue, TIndex>::operator=(ResizableArray&& other) noexcept
{
    if (this != &other)
    {
        deleteArray();
        m_size = other.m_size;
        m_values = other.m_values;
        other.m_size = 0;
        other.m_values = nullptr;
    }

    return *this;
}

template <typename TValue, IsUnsigned TIndex>
ResizableArray<TValue, TIndex>& ResizableArray<TValue, TIndex>::operator=(ResizableArray const& other)
{
    if (this != &other)
    {
        if (m_size != other.size())
        {
            deleteArray();
            m_values = allocateArray(other.size());
        }

        if (m_values == nullptr)
        {
            // the allocation failed, make safe
            m_size = 0;
        }
        else
        {
            m_size = other.m_size; // this must happen first
            copyArrayValues(other);
        }
    }

    return *this;
}

template <typename TValue, IsUnsigned TIndex> bool ResizableArray<TValue, TIndex>::resize(TIndex newSize)
{
    if (newSize <= m_size)
    {
        for (TIndex idx = newSize; idx < m_size; ++idx)
        {
            m_values[idx].~TValue();
        }
        m_size = newSize;
    }
    else
    {
        gsl::owner<TValue*> pNewValues = allocateArray(newSize);

        if (pNewValues == nullptr)
        {
            return false;
        }

        TIndex minSize = std::min(m_size, newSize);
        for (TIndex i = 0; i < minSize; ++i)
        {
            new (pNewValues + i) TValue(std::move_if_noexcept(m_values[i]));
        }

        for (TIndex i = minSize; i < newSize; ++i)
        {
            new (pNewValues + i) TValue();
        }

        deleteArray();
        m_size = newSize;
        m_values = pNewValues;
    }

    return true;
}

template <typename TValue, IsUnsigned TIndex> TValue ResizableArray<TValue, TIndex>::operator[](TIndex index) const
{
    Debug::debugAssert(index < m_size, "index out of bounds");
    return m_values[index];
}

template <typename TValue, IsUnsigned TIndex> TValue& ResizableArray<TValue, TIndex>::operator[](TIndex index)
{
    Debug::debugAssert(index < m_size, "index out of bounds");
    return m_values[index];
}

template <typename TValue, IsUnsigned TIndex> void ResizableArray<TValue, TIndex>::deleteArray()
{
    for (TIndex i = 0; i < m_size; ++i)
    {
        m_values[i].~TValue();
    }
    std::free(m_values);
}

template <typename TValue, IsUnsigned TIndex>
template <typename TOther>
void ResizableArray<TValue, TIndex>::copyArrayValues(TOther const& other)
{
    for (TIndex i = 0; i < m_size; ++i)
    {
        new (m_values + i) TValue(other.m_values[i]);
    }
}
template <typename TValue, IsUnsigned TIndex>
template <typename TOther>
void ResizableArray<TValue, TIndex>::moveArrayValues(TOther const& other)
{
    TIndex i = 0;
    for (auto const& value : other)
    {
        new (m_values + i) TValue(std::move_if_noexcept(value));
        ++i;
    }
}
template <typename TValue, IsUnsigned TIndex> TValue* ResizableArray<TValue, TIndex>::allocateArray(TIndex size)
{
    return static_cast<gsl::owner<TValue*>>(std::malloc(sizeof(TValue) * size));
}

} // namespace JsUtil