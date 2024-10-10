#pragma once

#include <gsl/pointers>

namespace JsUtil
{

template <typename T>
class PtrOwner
{
  public:
    ~PtrOwner() { delete m_ptr; }

    explicit PtrOwner(gsl::owner<T*> ptr)
        : m_ptr(ptr)
    {
    }
    PtrOwner(PtrOwner&& other) noexcept
        : m_ptr(other.m_ptr)
    {
        other.m_ptr = nullptr;
    }
    PtrOwner(PtrOwner const&) = delete;

    PtrOwner& operator=(PtrOwner&& other) noexcept
    {
        if (this != &other)
        {
            delete m_ptr;
            m_ptr = other.m_ptr;
            other.m_ptr = nullptr;
        }
        return *this;
    }
    PtrOwner& operator=(PtrOwner const&) = delete;

    T& operator*() const { return *m_ptr; }
    T* operator->() const { return m_ptr; }

    T*   get() const { return m_ptr; }
    void reset(gsl::owner<T*> newPtr = nullptr)
    {
        if (newPtr != m_ptr)
        {
            delete m_ptr;
            m_ptr = newPtr;
        }
    }

  private:
    gsl::owner<T*> m_ptr;
};

} // namespace JsUtil
