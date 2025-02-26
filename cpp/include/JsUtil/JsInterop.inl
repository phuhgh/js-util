#pragma once

namespace JsInterop
{

template <typename T>
SharedMemoryOwner<T>::SharedMemoryOwner(std::shared_ptr<T> ptr, TDescriptors&& descriptors)
    : ASharedMemoryObject(std::move(descriptors))
    , m_owningPtr(std::move(ptr))
{
    static_assert(!std::is_pointer_v<T>, "T must be a value type");
    static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    static_assert(!JsUtil::IsArrayPointer<T>::value, "T must be a value type");
}

template <typename TValue>
[[nodiscard]] gsl::owner<std::shared_ptr<ASharedMemoryObject>*> createSharedMemoryOwner(
    std::shared_ptr<TValue>             valuePtr,
    ASharedMemoryObject::TDescriptors&& descriptors
) noexcept
{
    if (valuePtr == nullptr)
    {
        return nullptr;
    }

    if constexpr (JsUtil::Debug::isDebug())
    {
        JsUtil::Debug::onBeforeAllocate();
    }

    auto* ownerPtr = new (std::nothrow) SharedMemoryOwner<TValue>(std::move(valuePtr), std::move(descriptors));

    if (ownerPtr == nullptr)
    {
        return nullptr;
    }

    auto ownerPtrPtr = new (std::nothrow) std::shared_ptr<ASharedMemoryObject>;

    if (ownerPtrPtr == nullptr)
    {
        delete ownerPtr;
    }
    else
    {
        ownerPtrPtr->reset(ownerPtr);
    }

    return ownerPtrPtr;
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
