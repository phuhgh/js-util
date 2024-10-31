#pragma once

#include "JsUtil/Pointers.hpp"
#include <gsl/pointers>

namespace JsInterop
{

struct ISharedMemoryObject
{
    virtual ~ISharedMemoryObject() = default;
             ISharedMemoryObject(void* valuePtr)
        : m_valuePtr(valuePtr)
    {
    }

    void* m_valuePtr{};
};

template <typename T>
struct SharedMemoryValue final : ISharedMemoryObject
{
    ~SharedMemoryValue() override = default;

    SharedMemoryValue(T&& value)
        : ISharedMemoryObject(nullptr)
        , m_value(std::move(value))
    {
        m_valuePtr = &m_value;
        static_assert(!std::is_pointer<T>::value, "T must be a value type");
        static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    }

    SharedMemoryValue(SharedMemoryValue const&) = delete;
    SharedMemoryValue(SharedMemoryValue&&) = delete;

    SharedMemoryValue& operator=(SharedMemoryValue const&) = delete;
    SharedMemoryValue& operator=(SharedMemoryValue&&) = delete;

    T m_value;
};

template <typename T>
using SharedMemoryValuePtr = gsl::owner<SharedMemoryValue<T>*>;

/**
 * Where there is an interface which is "primary", value semantics are very clunky to use in the C glue code. This can
 * be simplified at the cost of an extra dereference at use time. The cost of this is negligible relative to general
 * interop.
 */
template <typename T>
struct SharedMemoryOwner final : ISharedMemoryObject
{
    ~SharedMemoryOwner() override { delete m_owningPtr; }

    SharedMemoryOwner(gsl::owner<T*> ptr)
        : ISharedMemoryObject(static_cast<void*>(ptr))
        , m_owningPtr(ptr)
    {
        static_assert(!std::is_pointer<T>::value, "T must be a value type");
        static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
        static_assert(!JsUtil::IsArrayPointer<T>::value, "T must be a value type");
    }

    SharedMemoryOwner(SharedMemoryOwner const&) = delete;
    SharedMemoryOwner(SharedMemoryOwner&&) = delete;

    SharedMemoryOwner& operator=(SharedMemoryOwner const&) = delete;
    SharedMemoryOwner& operator=(SharedMemoryOwner&&) = delete;
    gsl::owner<T*>     m_owningPtr;
};

template <typename T>
using SharedMemoryOwnerPtr = gsl::owner<SharedMemoryOwner<T>*>;

template <typename T>
[[nodiscard]] SharedMemoryOwnerPtr<T> createSharedMemoryOwner(gsl::owner<T*> owner_ptr)
{
    if (owner_ptr == nullptr)
    {
        return nullptr;
    }

    auto* wrapper = new (std::nothrow) SharedMemoryOwner<T>(owner_ptr);

    if (wrapper == nullptr)
    {
        delete owner_ptr;
    }

    return wrapper;
}

} // namespace JsInterop