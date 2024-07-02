#pragma once

#include "JsUtil/Debug.h"
#include "JsUtil/TypeTraits.h"
#include <gsl/pointers>
#include <span>

namespace JsUtil
{

/**
 * @brief A container that becomes size 0 if it fails to allocate. Unlike e.g. std::vector, a default constructor is
 * currently required.
 * @remarks Construction of TValue() should not throw, exceptions more generally are not supported.
 * @remarks Should generally be viewed through `asSpan`.
 */
template <typename TValue, IsUnsigned TIndex = uint32_t> class ResizableArray
{
  public:
    // todo jack: move these into impl
    /**
     * @brief create an array of pointers, if allocation fails (use new std::nothrow) the element will be removed.
     * @remark You must delete the pointers when done, avoid using this unless there is no alternative...
     */
    template <typename TCallback>
        requires std::invocable<TCallback> && std::is_invocable_r<TValue, TCallback>::value
    static ResizableArray<TValue, TIndex> createPointerArray(TIndex size, TCallback createItem)
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

    template <typename T = TValue> typename std::enable_if<std::is_pointer<T>::value, void>::type compact()
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

    ~ResizableArray();

    explicit ResizableArray(TIndex size);
    ResizableArray(std::initializer_list<TValue> const& values);
    ResizableArray(ResizableArray const& other);
    ResizableArray(ResizableArray&& other) noexcept;

    ResizableArray& operator=(ResizableArray&& other) noexcept;
    ResizableArray& operator=(ResizableArray const& other);

    TValue  operator[](TIndex index) const;
    TValue& operator[](TIndex index);

    TIndex size() const { return m_size; }
    /// If the new size is smaller than the old size, success is guaranteed, otherwise check return (true is success)
    bool resize(TIndex newSize);

    std::span<TValue> asSpan() const { return std::span<TValue>(m_values, size_t(m_size)); }

  private:
    TIndex              m_size;
    gsl::owner<TValue*> m_values;

    void                            deleteArray();
    template <typename TOther> void copyArrayValues(TOther const& other);
    template <typename TOther> void moveArrayValues(TOther const& other);
    static gsl::owner<TValue*>      allocateArray(TIndex size);
};

} // namespace JsUtil

#include "JsUtil/ResizableArray.inl"