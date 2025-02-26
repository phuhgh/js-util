#pragma once

#include "JsUtil/Debug.hpp"
#include "JsUtil/HashMap.hpp"
#include "JsUtil/HashSet.hpp"
#include "JsUtil/Identifiers.hpp"
#include "JsUtil/Pointers.hpp"
#include "JsUtil/TypeTraits.hpp"

namespace JsInterop
{

class ASharedMemoryObject;

/**
 * @brief A description of an entity which is shared between JS and C++. For use on the JS side.
 */
struct InteropDescriptorBinding
{
    JsUtil::TInteropId categoryId{0};
    JsUtil::TInteropId specializationId{0};

    bool operator==(InteropDescriptorBinding const& other) const noexcept
    {
        return categoryId == other.categoryId && specializationId == other.specializationId;
    }
};
static_assert(std::is_standard_layout_v<InteropDescriptorBinding>);
static_assert(std::is_trivially_copyable_v<InteropDescriptorBinding>);
static_assert(offsetof(InteropDescriptorBinding, categoryId) == 0);
static_assert(offsetof(InteropDescriptorBinding, specializationId) == 2);

class ASharedMemoryObject
{
  public:
    /// category -> specialization
    using TDescriptors = JsUtil::HashMap<JsUtil::TInteropId, JsUtil::TInteropId>;

    template <typename TDesc>
    explicit ASharedMemoryObject(TDesc&& descriptors)
        : m_descriptors(std::forward<TDesc>(descriptors))
    {
    }
    virtual ~ASharedMemoryObject() = default;

    virtual void*       getValuePtr() = 0;
    virtual void const* getValuePtr() const = 0;

    bool addSpecialization(InteropDescriptorBinding descriptor)
    {
        return m_descriptors.insert(descriptor.categoryId, descriptor.specializationId) != nullptr;
    }

    bool removeSpecialization(InteropDescriptorBinding descriptor)
    {
        return m_descriptors.erase(descriptor.categoryId);
    }

    TDescriptors m_descriptors;
};

template <typename T>
struct SharedMemoryValue final : ASharedMemoryObject
{
    ~SharedMemoryValue() override = default;

    template <typename... TArgs>
    SharedMemoryValue(TDescriptors&& descriptors, TArgs&&... ctorArgs)
        : ASharedMemoryObject(std::move(descriptors))
        , m_value(std::forward<TArgs>(ctorArgs)...)
    {
        static_assert(!std::is_pointer_v<T>, "T must be a value type");
        static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    }

    SharedMemoryValue(TDescriptors&& descriptors, T&& moveable)
        : ASharedMemoryObject(std::move(descriptors))
        , m_value(std::move(moveable))
    {
        static_assert(!std::is_pointer_v<T>, "T must be a value type");
        static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    }

    SharedMemoryValue(SharedMemoryValue const&) = delete;
    SharedMemoryValue(SharedMemoryValue&&) = delete;

    SharedMemoryValue& operator=(SharedMemoryValue const&) = delete;
    SharedMemoryValue& operator=(SharedMemoryValue&&) = delete;

    void*       getValuePtr() override { return static_cast<void*>(&m_value); };
    void const* getValuePtr() const override { return static_cast<void const*>(&m_value); };

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
struct SharedMemoryOwner final : ASharedMemoryObject
{
    SharedMemoryOwner(std::shared_ptr<T> ptr, TDescriptors&& descriptors);

    void*       getValuePtr() override { return static_cast<void*>(m_owningPtr.get()); };
    void const* getValuePtr() const override { return static_cast<void const*>(m_owningPtr.get()); };

    std::shared_ptr<T> m_owningPtr;
};

template <typename TValue>
[[nodiscard]] gsl::owner<std::shared_ptr<ASharedMemoryObject>*> createSharedMemoryOwner(
    gsl::owner<TValue*>                 owner_ptr,
    ASharedMemoryObject::TDescriptors&& descriptors
) noexcept;

inline ASharedMemoryObject::TDescriptors createEmptyDescriptor()
{
    return ASharedMemoryObject::TDescriptors(0);
}

class JsCallback
{
  public:
    explicit JsCallback(unsigned index)
        : m_index(index)
    {
    }
    ~JsCallback();
    JsCallback(JsCallback&& other) noexcept
        : m_index(other.m_index)
    {
        other.m_index = -1;
    }
    JsCallback& operator=(JsCallback&& other) noexcept
    {
        if (&other != this)
        {
            m_index = other.m_index;
            other.m_index = -1;
        }

        return *this;
    }

    void callback();

  private:
    unsigned m_index;
};

class IdRegistry
{
  public:
    template <typename... TIds>
    static void               registerIdentifiers(std::tuple<TIds...> tuple);
    static unsigned           getCount() noexcept;
    static JsUtil::TInteropId getId(std::string_view name) noexcept;

  private:
    static JsUtil::HashMap<std::string_view, std::uint16_t>& getIds();
};

} // namespace JsInterop

#include "JsUtil/JsInterop.inl"
