
// todo jack: the language here is probably more verbose than it needs to be...

import type { IEventCategoryKey, IEventService } from "../event-service.js";
import type { IEntityGroup } from "../entity-group-core-model.js";

/**
 * @public
 * Emitted on entity being added to a group, not emitted if entity is already in the group.
 */
class OnEntityAddedToGroup<TTrait extends object>
    implements IEventCategoryKey<"onEntityAddedToGroup", [TTrait]>
{
    public readonly callbackKey = "onEntityAddedToGroup" as const;

    public constructor(
        public readonly parentCategory: IEventCategoryKey<"onEntityAddedToGroup", [object]> | null,
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
            listeners[i].onEntityAddedToGroup(entity);
        }

        if (this.parentCategory != null)
        {
            this.parentCategory.emit(eventService, entity);
        }
    }

    // todo jack: use or lose
    /**
     * @returns a specialization of `OnEntityAddedToGroupListener` but for the specific group (i.e. only triggered for additions to that group).
     */
    public createGroupCategory
    (
        group: IEntityGroup<unknown, TTrait>,
    )
        : IEventCategoryKey<"onEntityAddedToGroup", [TTrait]>
    {
        const cached = OnEntityAddedToGroup.cache.get(group);

        if (cached)
        {
            return cached;
        }
        else
        {
            const specialization = new OnEntityAddedToGroup(this);
            OnEntityAddedToGroup.cache.set(group, specialization);

            return specialization;
        }
    }

    private static readonly cache = new WeakMap<object, IEventCategoryKey<"onEntityAddedToGroup", [object]>>();
}

export const onEntityAddedToGroup = new OnEntityAddedToGroup(null);