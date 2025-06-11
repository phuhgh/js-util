#pragma once

#include "JsUtil/HashMap.hpp"
#include "JsUtil/JsInterop.hpp"
#include <memory>

namespace JsUtilQuadTree
{

struct HitTestableTrait
{
    bool          hitAllowed;
    std::uint16_t hitTestId;
};

inline constexpr JsUtil::IdCategory<HitTestableTrait, HitTestableTrait> scHIT_TESTABLE{"VT_HIT_TESTABLE", true};

class EntityGroup;

/**
 * todo jack: usage notes...
 * - A category can have an associated specialization, this association can be tagged in as many ways as you like
 * - e.g. Entity -> links to InteractionCategory -> Shared object with BufferCategory of Interleaved
 */
class Entity
{
  public:
    // todo jack: maybe have entity id here?
    static std::shared_ptr<Entity> createOne() noexcept { return std::shared_ptr<Entity>{new (std::nothrow) Entity{}}; }

    Entity(Entity const& other) = delete;
    Entity& operator=(Entity const& other) = delete;

    void onEntityAddedToGroup(EntityGroup* const& group)
    {
        JsUtil::Debug::debugAssert(group != nullptr, "expected group, got nullptr");
        m_memberships.insert(group);
    }
    void onEntityRemovedFromGroup(EntityGroup* group)
    {
        JsUtil::Debug::debugAssert(group != nullptr, "expected group, got nullptr");
        m_memberships.erase(group);
    }

    void addAssociation(JsUtil::TInteropId interopId, JsInterop::SharedMemoryOwner<void> owner)
    {
        if constexpr (JsUtil::Debug::isDebug())
        {
            JsUtil::Debug::debugAssert(
                owner.getValuePtr() != nullptr, "Associating null with an Id is considered a bug..."
            );
        }
        m_properties.insert(interopId, std::move(owner));
    }

    // todo jack: this had JsUtil::WithSpecializationKey<TKey> ||  which doesn't make any sense to me?
    template <typename TKey>
        requires(JsUtil::WithCategoryKey<TKey>)
    auto getAssociation(TKey const& key)
        -> JsInterop::SharedMemoryOwner<typename std::remove_cvref_t<decltype(key)>::TAssociatedType>*
    {
        using TLinked = JsInterop::SharedMemoryOwner<typename std::remove_cvref_t<decltype(key)>::TAssociatedType>;
        char const* name = key.getName();
        auto        id = JsInterop::IdRegistry::getId(name);
        auto*       ptr = m_properties.find(id);
        return static_cast<TLinked*>(static_cast<JsInterop::ASharedMemoryObject*>(ptr));
    }

    JsInterop::SharedMemoryOwner<void> getAssociation(JsUtil::TInteropId categoryId)
    {
        auto* ptr = m_properties.find(categoryId);
        JsUtil::Debug::debugAssert(ptr != nullptr, "expected to find association");
        return *ptr;
    }

  private:
    Entity() = default;
    JsUtil::HashMap<JsUtil::TInteropId, JsInterop::SharedMemoryOwner<void>> m_properties{};
    JsUtil::HashSet<EntityGroup*>                                           m_memberships{};
};

class EntityGroup
{
  public:
    static std::shared_ptr<EntityGroup> createOne() noexcept
    {
        return std::shared_ptr<EntityGroup>{new (std::nothrow) EntityGroup{}};
    }

    ~EntityGroup()
    {
        for (auto const& entity : m_entities)
        {
            entity->onEntityRemovedFromGroup(this);
        }
    }

    bool addEntity(std::shared_ptr<Entity> const& entity)
    {
        bool added = m_entities.insert(entity);
        if (added)
        {
            entity->onEntityAddedToGroup(this);
        }
        return added;
    }
    bool removeEntity(std::shared_ptr<Entity> const& entity)
    {
        bool removed = m_entities.erase(entity);
        if (removed)
        {
            entity->onEntityRemovedFromGroup(this);
        }
        return removed;
    }

  private:
    EntityGroup() = default;
    JsUtil::HashSet<std::shared_ptr<Entity>> m_entities{};
};

} // namespace JsUtilQuadTree
