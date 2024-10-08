#pragma once

#include "JsUtil/Debug.hpp"

namespace JsUtil
{

template <typename TValue, WithUnsigned TIndex>
template <typename TCallback>
    requires std::invocable<TCallback> && std::is_invocable_r<TValue, TCallback>::value
ResizableArray<TValue, TIndex> ResizableArray<TValue, TIndex>::createPointerArray(TIndex size, TCallback createItem)
{
    static_assert(std::is_pointer_v<TValue>, "TValue must be a pointer type");
    ResizableArray<TValue, TIndex> array(size);

    auto allocFailed = false;
    for (auto& ptr : array.asSpan())
    {
        ptr = createItem();
        if (ptr == nullptr)
        {
            allocFailed = true;
        }
    }

    if (allocFailed)
    {
        array.compact();
    }

    return array;
}

template <typename TValue, WithUnsigned TIndex>
template <typename T>
typename std::enable_if<std::is_pointer<T>::value, void>::type ResizableArray<TValue, TIndex>::compact()
{
    TIndex last = 0;
    for (TIndex i = 0; i < m_size; ++i)
    {
        if (m_values[i] != nullptr)
        {
            if (i != last)
            {
                m_values[last] = m_values[i];
                m_values[i] = nullptr;
            }
            ++last;
        }
    }

    resize(last);
}

template <typename TValue, WithUnsigned TIndex>
ResizableArray<TValue, TIndex>::~ResizableArray()
{
    deleteArray();
}

template <typename TValue, WithUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(TIndex size)
    : m_size(size)
    , m_values(std::move(allocateArray(size)))
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

template <typename TValue, WithUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(std::initializer_list<TValue> const& values)
    : m_size(values.size())
    , m_values(std::move(allocateArray(values.size())))
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

template <typename TValue, WithUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(ResizableArray const& other)
    : m_size(other.m_size)
    , m_values(std::move(allocateArray(other.size())))
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

template <typename TValue, WithUnsigned TIndex>
ResizableArray<TValue, TIndex>::ResizableArray(ResizableArray&& other) noexcept
    : m_size(other.m_size)
    , m_values(other.m_values)
{
    other.m_size = 0;
    other.m_values = nullptr;
}

template <typename TValue, WithUnsigned TIndex>
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

template <typename TValue, WithUnsigned TIndex>
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

template <typename TValue, WithUnsigned TIndex>
bool ResizableArray<TValue, TIndex>::resize(TIndex newSize)
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
            // ReSharper disable once CppDFANullDereference - if null, then size 0 (i.e. user problem...)
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

template <typename TValue, WithUnsigned TIndex>
TValue ResizableArray<TValue, TIndex>::operator[](TIndex index) const
{
    if constexpr (Debug::isDebug())
    {
        Debug::debugAssert(index < m_size, "index out of bounds");
    }
    return m_values[index];
}

template <typename TValue, WithUnsigned TIndex>
TValue& ResizableArray<TValue, TIndex>::operator[](TIndex index)
{
    if constexpr (Debug::isDebug())
    {
        Debug::debugAssert(index < m_size, "index out of bounds");
    }
    return m_values[index];
}

template <typename TValue, WithUnsigned TIndex>
void ResizableArray<TValue, TIndex>::deleteArray()
{
    for (TIndex i = 0; i < m_size; ++i)
    {
        // ReSharper disable once CppDFANullDereference - size zero if null
        m_values[i].~TValue();
    }
    std::free(m_values);
}

template <typename TValue, WithUnsigned TIndex>
template <typename TOther>
void ResizableArray<TValue, TIndex>::copyArrayValues(TOther const& other)
{
    for (TIndex i = 0; i < m_size; ++i)
    {
        new (m_values + i) TValue(other.m_values[i]);
    }
}

template <typename TValue, WithUnsigned TIndex>
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

template <typename TValue, WithUnsigned TIndex>
gsl::owner<TValue*> ResizableArray<TValue, TIndex>::allocateArray(TIndex size)
{
    if constexpr (Debug::isDebug())
    {
        Debug::onBeforeAllocate();
    }

    // ReSharper disable CppDFAMemoryLeak
    return static_cast<gsl::owner<TValue*>>(std::malloc(sizeof(TValue) * size));
    // ReSharper enable CppDFAMemoryLeak
}

} // namespace JsUtil