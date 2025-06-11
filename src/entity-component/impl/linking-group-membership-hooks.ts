import { IEntityGroup, IOnGroupChange } from "../entity-group-core-model.js";
import { IGroupLinkingKey, ILinkedEntityGroups } from "../i-linked-entity-groups.js";
import { TLinkableGroup } from "./entity-group.js";
import { DirtyCheckedUniqueCollection } from "../../collection/dirty-checked-unique-collection.js";
import { fpIdentity } from "../../fp/impl/fp-identity.js";
import { arrayEmptyArray } from "../../array/impl/array-empty-array.js";

/**
 * @public
 * todo jack naming is dire, for this to be useful it must be exposed on attributes
 *
 * todo jack: add unit tests for the key stuff (from is probably not tested)
 *
 * This is responsible for linking groups together (i.e. an entity getting added / removed from one affects the other).
 */
export class LinkingGroupMembershipHooks<TOptions, TTrait>
    implements ILinkedEntityGroups<TOptions, TTrait>,
               IOnGroupChange<TOptions, TTrait>
{
    public constructor
    (
        private group: TLinkableGroup<TOptions, unknown, TTrait>,
    )
    {
    }

    public linkFromGroup<TLinkedAttributes, TTrait>
    (
        groupToListenTo: TLinkableGroup<TOptions, TLinkedAttributes, TTrait>,
        key?: IGroupLinkingKey<TLinkedAttributes, TTrait>,
    )
        : void
    {
        groupToListenTo.linkedGroups.linkToGroup(
            this.group as any, // todo jack
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            key!,
        );
        this.onLinkedTo(groupToListenTo as any, key); // todo jack
    }

    public linkToGroup<TLinkedAttributes, TTrait>
    (
        groupToBroadcastTo: TLinkableGroup<TOptions, TLinkedAttributes, TTrait>,
        key?: IGroupLinkingKey<TLinkedAttributes, TTrait>,
    )
        : void
    {
        this.linkingTo.add(groupToBroadcastTo as any);// todo jack

        if (key != null)
        {
            DirtyCheckedUniqueCollection.mapInitializeAdd(this.toLinksByKey, key, groupToBroadcastTo as any); // todo jack
        }

        // let the group know that we're broadcasting to it
        groupToBroadcastTo.linkedGroups.onLinkedTo(this.group as any, key); // todo jack
    }

    public onLinkedTo
    (
        groupToListenTo: TLinkableGroup<TOptions, unknown, TTrait>,
        key?: IGroupLinkingKey<unknown, unknown>,
    )
        : void
    {
        this.linkingFrom.add(groupToListenTo);

        if (key != null)
        {
            DirtyCheckedUniqueCollection.mapInitializeAdd(this.fromLinksByKey, key, groupToListenTo);
        }
    }

    public unlinkGroup(group: TLinkableGroup<TOptions, unknown, TTrait>): void
    {
        // todo jack: need better tests for this, could be optimized too
        let wasConnected = this.linkingTo.delete(group);
        wasConnected ||= this.linkingFrom.delete(group);

        if (wasConnected)
        {
            // do the other end
            group.linkedGroups.unlinkGroup(this.group);
        }

        this.toLinksByKey.forEach((linkedGroups) =>
        {
            linkedGroups.delete(group);
        });
        this.fromLinksByKey.forEach((linkedGroups) =>
        {
            linkedGroups.delete(group);
        });
    }

    // todo jack: test me, optimize me
    public unlinkAllGroups(): void
    {
        this.linkingTo.getArray().forEach(group => this.unlinkGroup(group));
        this.linkingFrom.getArray().forEach(group => this.unlinkGroup(group));
    }

    public onEntityAdded(entity: TTrait, options: TOptions): void
    {
        const links = this.linkingTo.getArray();

        for (let i = 0, iEnd = links.length; i < iEnd; ++i)
        {
            links[i].addEntity(entity, options, fpIdentity);
        }
    }

    public onEntityRemoved
    (
        entity: TTrait,
    )
        : void
    {
        const links = this.linkingTo.getArray();

        for (let i = 0, iEnd = links.length; i < iEnd; ++i)
        {
            links[i].removeEntity(entity);
        }
    }

    public getGroupsLinkingTo<TLinkedAttributes, TTrait>
    (
        key?: IGroupLinkingKey<TLinkedAttributes, TTrait>,
    )
        : readonly IEntityGroup<TLinkedAttributes, TTrait>[]
    {
        if (key != null)
        {
            const links = this.toLinksByKey.get(key);

            return (links?.getArray() ?? arrayEmptyArray) as any;// todo jack
        }

        return this.linkingTo.getArray() as any;// todo jack
    }

    public getGroupsLinkingFrom<TLinkedAttributes, TTrait>
    (
        key?: IGroupLinkingKey<TLinkedAttributes, TTrait>,
    )
        : readonly IEntityGroup<TLinkedAttributes, TTrait>[]
    {
        if (key != null)
        {
            const links = this.fromLinksByKey.get(key);

            return (links?.getArray() ?? arrayEmptyArray) as any;// todo jack
        }

        return this.linkingFrom.getArray() as any; // todo jack
    }

    private readonly toLinksByKey = new Map<IGroupLinkingKey<unknown, unknown>, DirtyCheckedUniqueCollection<TLinkableGroup<TOptions, unknown, TTrait>>>();
    private readonly fromLinksByKey = new Map<IGroupLinkingKey<unknown, unknown>, DirtyCheckedUniqueCollection<TLinkableGroup<TOptions, unknown, TTrait>>>();
    private readonly linkingTo = new DirtyCheckedUniqueCollection<TLinkableGroup<TOptions, unknown, TTrait>>();
    private readonly linkingFrom = new DirtyCheckedUniqueCollection<TLinkableGroup<TOptions, unknown, TTrait>>();
}
