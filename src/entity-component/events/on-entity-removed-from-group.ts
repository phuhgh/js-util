import type { IEventCategoryKey, IEventService } from "../event-service.js";
import type { IEntityGroup } from "../entity-group-core-model.js";

/**
 * @public
 * Emitted on entity removed from group, if the entity is not present this is not emitted.
 */
class OnEntityRemovedFromGroup<TTrait extends object>
    implements IEventCategoryKey<"onEntityRemovedFromGroup", [TTrait]>
{
    public readonly callbackKey = "onEntityRemovedFromGroup" as const;

    public constructor(
        public readonly parentCategory: IEventCategoryKey<"onEntityRemovedFromGroup", [object]> | null,
    )
    {
    }

    public emit
    (
        eventService: IEventService,
        entity: TTrait,
    )
        : void
    {
        const listeners = eventService
            .getCategory(this)
            .getTargets();

        for (let i = 0, iEnd = listeners.length; i < iEnd; ++i)
        {
            listeners[i].onEntityRemovedFromGroup(entity);
        }

        if (this.parentCategory != null)
        {
            this.parentCategory.emit(eventService, entity);
        }
    }

    // todo jack: use or lose
    /**
     * @returns a specialization of `OnEntityRemovedFromGroupListener` but for the specific group (i.e. only triggered for additions to that group).
     */
    public createGroupCategory
    (
        group: IEntityGroup<unknown, TTrait>,
    )
        : IEventCategoryKey<"onEntityRemovedFromGroup", [TTrait]>
    {
        const cached = OnEntityRemovedFromGroup.cache.get(group);

        if (cached)
        {
            return cached;
        }
        else
        {
            const specialization = new OnEntityRemovedFromGroup(this);
            OnEntityRemovedFromGroup.cache.set(group, specialization);

            return specialization;
        }
    }

    private static readonly cache = new WeakMap<object, IEventCategoryKey<"onEntityRemovedFromGroup", [object]>>();
}

export const onEntityRemovedFromGroup = new OnEntityRemovedFromGroup(null);