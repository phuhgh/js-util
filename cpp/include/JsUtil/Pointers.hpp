#pragma once

#include <gsl/pointers>

namespace JsUtil
{

template <typename T>
struct IsSmartPointer : std::false_type
{
};

template <typename T>
struct IsSmartPointer<std::unique_ptr<T>> : std::true_type
{
};

template <typename T>
struct IsSmartPointer<std::shared_ptr<T>> : std::true_type
{
};

template <typename T>
struct IsSmartPointer<std::weak_ptr<T>> : std::true_type
{
};

template <typename T>
struct IsArrayPointer : std::false_type
{
};

template <typename T>
struct IsArrayPointer<T[]> : std::true_type
{
};

template <typename T, std::size_t N>
struct IsArrayPointer<T[N]> : std::true_type
{
};

template <typename T>
class ScopedPointer
{
  public:
    ~ScopedPointer() { delete m_ptr; }

    explicit ScopedPointer(gsl::owner<T*> ptr)
        : m_ptr(ptr)
    {
    }
    ScopedPointer(ScopedPointer&& other) noexcept
        : m_ptr(other.m_ptr)
    {
        other.m_ptr = nullptr;
    }
    ScopedPointer(ScopedPointer const&) = delete;

    ScopedPointer& operator=(ScopedPointer&& other) noexcept
    {
        if (this != &other)
        {
            delete m_ptr;
            m_ptr = other.m_ptr;
            other.m_ptr = nullptr;
        }
        return *this;
    }
    ScopedPointer& operator=(ScopedPointer const&) = delete;

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
