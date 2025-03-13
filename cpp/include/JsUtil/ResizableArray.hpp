#pragma once

#include "JsUtil/TypeTraits.hpp"
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
template <typename TValue, WithUnsigned TIndex = uint32_t>
class ResizableArray
{
  public:
    // imitate stl containers
    using value_type = TValue;
    using size_type = TIndex;

    /**
     * @brief create an array of pointers, if allocation fails (use new std::nothrow) the element will be removed.
     * @remark You must delete the pointers when done, avoid using this unless there is no alternative...
     */
    template <typename TCallback>
        requires std::invocable<TCallback> && std::is_invocable_r<TValue, TCallback>::value
    static ResizableArray<TValue, TIndex> createPointerArray(TIndex size, TCallback createItem);

    template <typename T = TValue>
    typename std::enable_if<WithPointerOrSmartPointer<T>::value, void>::type compact();

    // noexcept if TValue is noexcept...
    ~ResizableArray();

    // noexcept if TValue is noexcept...
    explicit ResizableArray(TIndex size);
    ResizableArray(std::initializer_list<TValue> const& values);
    ResizableArray(ResizableArray const& other);
    ResizableArray(ResizableArray&& other) noexcept;

    ResizableArray& operator=(ResizableArray&& other) noexcept;
    ResizableArray& operator=(ResizableArray const& other);

    TValue const& operator[](TIndex index) const noexcept;
    TValue&       operator[](TIndex index) noexcept;

    TIndex size() const noexcept { return m_size; }
    /// If the new size is smaller than the old size, success is guaranteed, otherwise check return (true is success)
    bool resize(TIndex newSize);

    TValue*       data() noexcept { return m_values; }
    TValue const* data() const noexcept { return m_values; }

    operator std::span<TValue>() const noexcept { return asSpan(); }
    std::span<TValue> asSpan() const noexcept { return std::span<TValue>(m_values, size_t(m_size)); }

  private:
    void deleteArray();
    template <typename TOther>
    void copyArrayValues(TOther const& other);
    template <typename TOther>
    void                       moveArrayValues(TOther const& other);
    static gsl::owner<TValue*> allocateArray(TIndex size) noexcept;

    TIndex              m_size;
    gsl::owner<TValue*> m_values;
};

} // namespace JsUtil

#include "JsUtil/ResizableArray.inl"