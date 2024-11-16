#pragma once

#include "JsUtil/Pointers.hpp"

namespace JsInterop
{

template <typename T>
SharedMemoryValue<T>::SharedMemoryValue(T&& value, TDescriptors&& descriptors)
    : ASharedMemoryObject(std::move(descriptors))
    , m_value(std::move(value))
{
    static_assert(!std::is_pointer_v<T>, "T must be a value type");
    static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
}

template <typename T>
SharedMemoryOwner<T>::SharedMemoryOwner(
    gsl::owner<T*, std::enable_if_t<std::is_pointer_v<T*>>> ptr,
    TDescriptors&&                                          descriptors
)
    : ASharedMemoryObject(std::move(descriptors))
    , m_owningPtr(ptr)
{
    static_assert(!std::is_pointer_v<T>, "T must be a value type");
    static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    static_assert(!JsUtil::IsArrayPointer<T>::value, "T must be a value type");
}

template <typename TValue>
[[nodiscard]] SharedMemoryOwnerPtr<TValue> createSharedMemoryOwner(
    gsl::owner<TValue*>                 owner_ptr,
    ASharedMemoryObject::TDescriptors&& descriptors
) noexcept
{
    if (owner_ptr == nullptr)
    {
        return nullptr;
    }

    if constexpr (JsUtil::Debug::isDebug())
    {
        JsUtil::Debug::onBeforeAllocate();
    }

    auto* wrapper = new (std::nothrow) SharedMemoryOwner<TValue>(owner_ptr, std::move(descriptors));

    if (wrapper == nullptr)
    {
        delete owner_ptr;
    }

    return wrapper;
}
template <typename... TIds>
void IdRegistry::registerIdentifiers(std::tuple<TIds...> tuple)
{
    TupleExt::forEach(tuple, [&](auto& identifier) {
        using TId = std::decay_t<decltype(identifier)>;
        static_assert(
            JsUtil::WithSpecializationKey<TId> || JsUtil::WithCategoryKey<TId>,
            "identifier must be either a specialization key or a category key"
        );

        auto& ids = getIds();

        if constexpr (JsUtil::Debug::isDebug())
        {
            JsUtil::Debug::debugAssert(
                ids.find(identifier.getName()) == nullptr, "inserted identifier with same name twice"
            );
        }

        if constexpr (JsUtil::WithSpecializationKey<TId>)
        {
            auto stableId = getSpecializationId(identifier);
            ids.insert(identifier.getName(), stableId);
        }
        else if constexpr (JsUtil::WithCategoryKey<TId>)
        {
            auto stableId = getCategoryId(identifier);
            ids.insert(identifier.getName(), stableId);
        }
    });
}

inline unsigned IdRegistry::getCount() noexcept
{
    auto& ids = getIds();
    return ids.size();
}

inline JsUtil::TInteropId IdRegistry::getId(std::string_view name) noexcept
{
    JsUtil::Debug::debugAssert(!name.empty(), "name must not be empty");
    auto& ids = getIds();
    auto  ptr = ids.find(name);
    JsUtil::Debug::debugAssert(ptr != nullptr, "expected to find entry, but it was not populated");
    return *ptr;
}

} // namespace JsInterop
