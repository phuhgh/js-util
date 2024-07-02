#pragma once

#include "JsUtil/CircularBuffer.h"
#include "JsUtil/Debug.h"
#include <memory>

namespace JsUtil
{

/**
 * @remarks Does not affect underflow, which is considered to be undefined behavior.
 */
enum class ECircularStackOverflowMode
{
    /**
     * Do nothing, i.e. ignore the pushed element.
     */
    NoOp = 1,
    /**
     * Trips a debug assert, but otherwise equivalent to NoOp.
     */
    DebugException,
    /**
     * Overwrite the first value.
     */
    Overwrite,
    /**
     * Doubles the stack size and copies in place, running in O(size).
     */
    Grow,
};

template <typename TValue, typename TIndex, typename TStorage> class CircularFIFOStackBase;

/// methods no explicitly marked unsafe are safe in single producer consumer usage
template <typename TValue, IsUnsigned TIndex> class CircularFIFOStackBase<TValue, TIndex, std::atomic<TIndex>>
{
  public:
    explicit CircularFIFOStackBase(TIndex capacity)
        : m_buffer(CircularBuffer<TValue>(capacity))
    {
        Debug::debugAssert(capacity > 0, "0 capacity buffer is definitely a bug");
    }

    /// not thread safe
    CircularFIFOStackBase(CircularFIFOStackBase&& other) noexcept
        : m_buffer(std::move(other.m_buffer))
        , m_start(other.m_start.load())
        , m_end(other.m_end.load())
    {
    }

    /// not thread safe
    CircularFIFOStackBase& operator=(CircularFIFOStackBase&& other) noexcept
    {
        if (this != &other)
        {
            m_buffer = std::move(other.m_buffer);
            m_start.store(other.m_start.load());
            m_end.store(other.m_end.load());
        }
        return *this;
    }

    TValue& operator[](TIndex index)
    {
        Debug::debugAssert(index + m_start < m_end, "index out of bounds");
        return m_buffer[index + m_start];
    }

    TValue pop()
    {
        Debug::debugAssert(!getIsEmpty(), "Attempted to pop empty stack.");

        return std::move(m_buffer[m_start++]);
    }

    bool   getIsEmpty() const { return m_start == m_end; }
    TIndex getCapacity() const { return m_buffer.getSize(); }
    /** the number of pushes left */
    TIndex getRemainingCapacity() const { return m_start + m_buffer.getSize() - m_end; }
    /** the number of pops left */
    TIndex getElementCount() const { return m_end - m_start; }
    TIndex getAbsoluteStart() const { return m_start.load(); }
    TIndex getAbsoluteEnd() const { return m_end.load(); }

  protected:
    CircularBuffer<TValue> m_buffer;    // NOLINT(*-non-private-member-variables-in-classes)
    std::atomic<TIndex>    m_start = 0; // NOLINT(*-non-private-member-variables-in-classes)
    std::atomic<TIndex>    m_end = 0;   // NOLINT(*-non-private-member-variables-in-classes)
};

template <typename TValue, IsUnsigned TIndex> class CircularFIFOStackBase<TValue, TIndex, TIndex>
{
  public:
    explicit CircularFIFOStackBase(TIndex capacity)
        : m_buffer(CircularBuffer<TValue>(capacity))
    {
        Debug::debugAssert(capacity > 0, "0 capacity buffer is definitely a bug");
    }

    TValue& operator[](TIndex index)
    {
        Debug::debugAssert(index + m_start < m_end, "index out of bounds");
        return m_buffer[index + m_start];
    }

    TValue pop()
    {
        Debug::debugAssert(!getIsEmpty(), "Attempted to pop empty stack.");

        return std::move(m_buffer[m_start++]);
    }

    bool   getIsEmpty() const { return m_start == m_end; }
    TIndex getCapacity() const { return m_buffer.getSize(); }
    /** the number of pushes left */
    TIndex getRemainingCapacity() const { return m_start + m_buffer.getSize() - m_end; }
    /** the number of pops left */
    TIndex getElementCount() const { return m_end - m_start; }
    TIndex getAbsoluteStart() const { return m_start; }
    TIndex getAbsoluteEnd() const { return m_end; }

  protected:
    CircularBuffer<TValue> m_buffer;    // NOLINT(*-non-private-member-variables-in-classes)
    TIndex                 m_start = 0; // NOLINT(*-non-private-member-variables-in-classes)
    TIndex                 m_end = 0;   // NOLINT(*-non-private-member-variables-in-classes)
};

template <typename TValue, ECircularStackOverflowMode TMode, IsUnsigned TIndex = size_t, typename TStorage = TIndex>
class CircularFIFOStack
{
};

/// thread safe for single producer consumer pair
template <typename TValue, IsUnsigned TIndex, typename TStorage>
class CircularFIFOStack<TValue, ECircularStackOverflowMode::NoOp, TIndex, TStorage>
    : public CircularFIFOStackBase<TValue, TIndex, TStorage>
{
  public:
    explicit CircularFIFOStack(TIndex capacity)
        : CircularFIFOStackBase<TValue, TIndex, TStorage>(capacity)
    {
    }

    CircularFIFOStack(CircularFIFOStack&& other) noexcept
        : CircularFIFOStackBase<TValue, TIndex, TStorage>(std::move(other))
    {
    }

    CircularFIFOStack& operator=(CircularFIFOStack&& other) noexcept
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TStorage>;
        Base::operator=(std::move(other));
        return *this;
    }

    /**
     * @return true if the element was added, else false.
     */
    bool push(TValue&& value)
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TStorage>;

        if (Base::getRemainingCapacity() == 0)
        {
            return false;
        }

        Base::m_buffer[Base::m_end++] = std::forward<TValue>(value);
        return true;
    }
};

/// __NOT__ thread safe, at all!
template <typename TValue, IsUnsigned TIndex>
class CircularFIFOStack<TValue, ECircularStackOverflowMode::Grow, TIndex>
    : public CircularFIFOStackBase<TValue, TIndex, TIndex>
{
  public:
    explicit CircularFIFOStack(TIndex capacity)
        : CircularFIFOStackBase<TValue, TIndex, TIndex>(capacity)
    {
    }

    bool push(TValue&& value)
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TIndex>;

        if (Base::getRemainingCapacity() == 0)
        {
            if (!growStack())
            {
                // failed to grow stack (probably OOM...)
                return false;
            }
        }

        Base::m_buffer[Base::m_end++] = std::forward<TValue>(value);
        return true;
    }

  private:
    bool growStack()
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TIndex>;
        auto replacement =
            CircularFIFOStack<TValue, ECircularStackOverflowMode::Grow, TIndex>(Base::m_buffer.getSize() * 2);

        if (replacement.getCapacity() == 0)
        {
            // failed to allocated
            return false;
        }

        auto size = Base::m_buffer.getSize();
        while (size--)
        {
            replacement.push(std::move(Base::pop()));
        }

        Base::m_buffer = std::move(replacement.m_buffer);
        Base::m_start = replacement.m_start;
        Base::m_end = replacement.m_end;

        return true;
    }
};

/// __NOT__ thread safe, at all!
template <typename TValue, IsUnsigned TIndex>
class CircularFIFOStack<TValue, ECircularStackOverflowMode::Overwrite, TIndex>
    : public CircularFIFOStackBase<TValue, TIndex, TIndex>
{
  public:
    explicit CircularFIFOStack(TIndex capacity)
        : CircularFIFOStackBase<TValue, TIndex, TIndex>(capacity)
    {
    }

    /**
     * @return The value that was popped, if any.
     */
    std::optional<TValue> push(TValue&& value)
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TIndex>;
        std::optional<TValue> popped = std::nullopt;

        if (Base::getRemainingCapacity() == 0)
        {
            popped = Base::pop();
        }

        Base::m_buffer[Base::m_end++] = std::forward<TValue>(value);
        return popped;
    }
};

/// thread safe for single producer consumer pair
template <typename TValue, IsUnsigned TIndex, typename TStorage>
class CircularFIFOStack<TValue, ECircularStackOverflowMode::DebugException, TIndex, TStorage>
    : public CircularFIFOStackBase<TValue, TIndex, TStorage>
{
  public:
    explicit CircularFIFOStack(TIndex capacity)
        : CircularFIFOStackBase<TValue, TIndex, TStorage>(capacity)
    {
    }

    CircularFIFOStack(CircularFIFOStack&& other) noexcept
        : CircularFIFOStackBase<TValue, TIndex, TStorage>(std::move(other))
    {
    }

    CircularFIFOStack& operator=(CircularFIFOStack&& other) noexcept
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TStorage>;
        Base::operator=(std::move(other));
        return *this;
    }

    /**
     * @return true if the element was added, else false.
     */
    bool push(TValue&& value)
    {
        using Base = CircularFIFOStackBase<TValue, TIndex, TStorage>;

        if (Base::getRemainingCapacity() == 0)
        {
            Debug::error("Attempted to push to full stack.");

            return false;
        }

        Base::m_buffer[Base::m_end++] = std::forward<TValue>(value);
        return true;
    }
};

} // namespace JsUtil
