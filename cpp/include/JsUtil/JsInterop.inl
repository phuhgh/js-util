#pragma once

namespace JsInterop
{

template <typename T>
WeakSharedMemoryOwner<T>::WeakSharedMemoryOwner(std::shared_ptr<T> ptr, TDescriptors&& descriptors)
    : ASharedMemoryObject(std::move(descriptors))
    , m_weakPtr(std::move(ptr))
{
    static_assert(!std::is_pointer_v<T>, "T must be a value type");
    static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    static_assert(!JsUtil::IsArrayPointer<T>::value, "T must be a value type");
}

template <typename T>
SharedMemoryOwner<T>::SharedMemoryOwner(std::shared_ptr<T> ptr, TDescriptors&& descriptors)
    : ASharedMemoryObject(std::move(descriptors))
    , m_owningPtr(std::move(ptr))
{
    static_assert(!std::is_pointer_v<T>, "T must be a value type");
    static_assert(!JsUtil::IsSmartPointer<T>::value, "T must be a value type");
    static_assert(!JsUtil::IsArrayPointer<T>::value, "T must be a value type");

    if constexpr (JsUtil::Debug::isDebug())
    {
        static auto const sTAGS = std::array<char const*, 4>{{"WASM", "MEMORY", "ALLOCATIONS", "CPP"}};
        std::stringstream ss;
        ss << "Created SharedMemoryOwner: " << "0x" << std::hex << reinterpret_cast<std::uintptr_t>(this)
           << ", holding a reference to: " << std::hex << reinterpret_cast<std::uintptr_t>(m_owningPtr.get());
        auto str = ss.str();
        JsUtil::Debug::verboseLog(str.c_str(), sTAGS);
    }
}

template <typename T>
SharedMemoryOwner<T>::~SharedMemoryOwner()
{
    if constexpr (JsUtil::Debug::isDebug())
    {
        static auto const sTAGS = std::array<char const*, 4>{{"WASM", "MEMORY", "DEALLOCATIONS", "CPP"}};
        std::stringstream ss;
        ss << "Destroyed SharedMemoryOwner: " << "0x" << std::hex << reinterpret_cast<std::uintptr_t>(this);
        auto str = ss.str();
        JsUtil::Debug::verboseLog(str.c_str(), sTAGS);
    }
}

template <typename TValue>
[[nodiscard]] gsl::owner<ASharedMemoryObject*> createSharedMemoryOwner(
    gsl::owner<TValue*>                 valuePtr,
    ASharedMemoryObject::TDescriptors&& descriptors
) noexcept
{
    return createSharedMemoryOwner(std::shared_ptr<TValue>{valuePtr}, std::move(descriptors));
}

template <typename TValue>
[[nodiscard]] gsl::owner<ASharedMemoryObject*> createSharedMemoryOwner(
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

    return new (std::nothrow) SharedMemoryOwner<TValue>(valuePtr, std::move(descriptors));
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
            JsUtil::Debug::debugAssert(!identifier.category->isFlag, "flags may not be specialized");
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
