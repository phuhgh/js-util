#pragma once

#include <atomic>

template <typename TCounted> class CreateDestroyTestCounter : public TCounted
{
  public:
    template <typename... Args>
    explicit CreateDestroyTestCounter(Args... args)
        : TCounted(std::forward<Args>(args)...)
    {
        m_default_constructed++;
    }

    static std::atomic<unsigned> m_default_constructed;
    static std::atomic<unsigned> m_destroyed;
    static std::atomic<unsigned> m_copy_constructed;
    static std::atomic<unsigned> m_move_constructed;

    static void reset()
    {
        m_default_constructed = 0;
        m_destroyed = 0;
        m_copy_constructed = 0;
        m_move_constructed = 0;
    }
    static unsigned getTotalConstructedCount()
    {
        return m_default_constructed + m_copy_constructed + m_move_constructed;
    }

    CreateDestroyTestCounter() { m_default_constructed++; }
    CreateDestroyTestCounter(CreateDestroyTestCounter const&& other) noexcept
        : TCounted(other)
    {
        m_move_constructed++;
    }
    CreateDestroyTestCounter& operator=(CreateDestroyTestCounter&&) noexcept
    {
        m_move_constructed++;
        return *this;
    }
    CreateDestroyTestCounter(CreateDestroyTestCounter const& other)
        : TCounted(other)
    {
        m_copy_constructed++;
    }
    CreateDestroyTestCounter& operator=(CreateDestroyTestCounter const)
    {
        m_copy_constructed++;
        return *this;
    }

    ~CreateDestroyTestCounter() { m_destroyed++; }
};

template <typename TCounted> std::atomic<unsigned> CreateDestroyTestCounter<TCounted>::m_default_constructed = 0;

template <typename TCounted> std::atomic<unsigned> CreateDestroyTestCounter<TCounted>::m_destroyed = 0;

template <typename TCounted> std::atomic<unsigned> CreateDestroyTestCounter<TCounted>::m_copy_constructed = 0;

template <typename TCounted> std::atomic<unsigned> CreateDestroyTestCounter<TCounted>::m_move_constructed = 0;
