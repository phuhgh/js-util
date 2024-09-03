#pragma once

#include <mutex>
#include <optional>
#include <shared_mutex>
#include <type_traits>

namespace JsUtil
{

/**
 * @brief Provides basic locking functionality for a value
 * @tparam T - The value type to be locked.
 */
template <typename T>
class SmartLocked
{
  public:
    class ReadonlyReference
    {
        friend class SmartLocked;

      public:
        T const& operator*() const { return m_value; }
        T const* operator->() const { return &m_value; }

      private:
        ReadonlyReference(T const& value, std::shared_mutex& mutex)
            : m_value(value)
            , m_lock(mutex)
        {
        }

        T const&                            m_value;
        std::shared_lock<std::shared_mutex> m_lock;
    };
    class MutableReference
    {
        friend class SmartLocked;

      public:
        T& operator*() { return m_value; }
        T* operator->() { return &m_value; }

      private:
        MutableReference(T& value, std::unique_lock<std::shared_mutex>&& lock)
            : m_value(value)
            , m_lock(std::move(lock))
        {
        }

        T&                                  m_value;
        std::unique_lock<std::shared_mutex> m_lock;
    };

    SmartLocked(T val)
        : m_val(std::move(val))
    {
    } // NOLINT(*-explicit-constructor)

    /**
     * @remark Blocks during the copy.
     * @return The value, by copy.
     */
    T get() const
    {
        std::shared_lock<std::shared_mutex> lock{m_mutex};
        return m_val;
    }

    /**
     * @remark Allows many readers.
     * @return A readonly reference to the value, locked for as long as ReadonlyReference lives.
     */
    ReadonlyReference getReadonlyRef() const { return ReadonlyReference(m_val, m_mutex); }
    /**
     * @remark Allows single reader / writer.
     * @return A reference to the value, locked for as long as MutableReference lives.
     */
    MutableReference getMutableRef() { return MutableReference(m_val, std::unique_lock<std::shared_mutex>{m_mutex}); }

    /**
     * @remark Blocks during the write.
     * @param val - The new value.
     */
    void set(T val)
    {
        std::unique_lock lock{m_mutex};
        m_val = val;
    }

    /**
     * @remark Blocks during the write.
     * @param val - The new value.
     */
    void emplace(T&& val)
    {
        std::unique_lock lock{m_mutex};
        m_val = std::move(val);
    }

  private:
    T                         m_val;
    mutable std::shared_mutex m_mutex;
};

} // namespace JsUtil
