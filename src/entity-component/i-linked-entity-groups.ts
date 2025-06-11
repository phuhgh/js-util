import { IEntityGroup } from "./entity-group-core-model.js";
import { TLinkableGroup } from "./impl/entity-group.js";
import type { TSubtypeAssertError } from "./utility-types.js";

// todo jack: I don't know if this is really worth keeping
/**
 * @public
 * Allows the specification of constraints for linked {@link IEntityGroup}s. todo jack11: pretty sure we use the object as a key too, document it.
 */
export interface IGroupLinkingKey<TGroupAttributes, TTrait>
{
    debugId?: string;

    /**
     * @summary Specifies the requirement on the linked group's attributes.
     * @remark Compile time only!
     */
    TGroupAttributes: TGroupAttributes;
    /**
     * @summary Specifies the requirement on the type of entity that must in linked the linked {@link IEntityGroup}.
     * @remark Compile time only!
     */
    TTrait: TTrait;
}

/**
 * @public
 * Factory for creating {@link IGroupLinkingKey}.
 */
export class LinkingKeyFactory
{
    public static createOne<TGroupAttributes, TTrait>(debugIdentifier: string): IGroupLinkingKey<TGroupAttributes, TTrait>
    {
        // it's not part of the interface, but include a debug id as it would otherwise be unidentifiable
        return {
            debugId: debugIdentifier,
        } as IGroupLinkingKey<TGroupAttributes, TTrait>;
    }
}

/**
 * @public
 * Linking facilities for {@link IEntityGroup}, so that entities added to one group are added to linked groups.
 * todo jack11 how come this isn't on the base one?
 */
export interface ILinkedEntityGroups<TOptions, TTrait>
{
    /**
     * When an entity is added to `groupToListenTo`, it will be added to this group as well.
     */
    linkFromGroup
    (
        groupToListenTo: TLinkableGroup<TOptions, unknown, TTrait>,
    )
        : void;
    /**
     * When an entity is added to `groupToListenTo`, it will be added to this group as well, but with the additional constraints of `linkingKey`.
     */
    linkFromGroup<TKeyAttributes, TLinkedAttributes extends TKeyAttributes, TKeyTrait, TTrait extends TKeyTrait>
    (
        groupToListenTo: TLinkableGroup<TOptions, TLinkedAttributes, TTrait>,
        key: IGroupLinkingKey<TKeyAttributes, TKeyTrait>,
    )
        : void;

    /**
     * When an entity is added to this group, it will be added to `groupToBroadcastTo` as well.
     */
    linkToGroup<TReceiverOpts, TReceiverTrait>
    (
        groupToBroadcastTo: TOptions extends TReceiverOpts
            ? TTrait extends TReceiverTrait
                ? TLinkableGroup<TReceiverOpts, unknown, TReceiverTrait>
                : TSubtypeAssertError
            : TSubtypeAssertError,
    )
        : void;

    /**
     * When an entity is added to this group, it will be added to `groupToBroadcastTo` as well, but with the additional constraints of `linkingKey`.
     */
    linkToGroup<TBroadcastToOptions
        , TKeyAttributes
        , TLinkedAttributes extends TKeyAttributes
        , TKeyTrait
        , TTrait extends TKeyTrait>
    (
        groupToBroadcastTo: TOptions extends TBroadcastToOptions
            ? TTrait extends TKeyTrait
                ? TLinkableGroup<TBroadcastToOptions, TLinkedAttributes, TTrait>
                : TSubtypeAssertError
            : TSubtypeAssertError,
        linkingKey: IGroupLinkingKey<TKeyAttributes, TKeyTrait>,
    )
        : void;

    /**
     * Removes both directions of a link.
     */
    unlinkGroup(group: IEntityGroup<unknown, TTrait>): void;

    /**
     * Like `unlinkGroup`, but applied to all groups this group is linked to.
     */
    unlinkAllGroups(): void;

    /**
     * @internal
     * Called on group registering to broadcasting to this one. Not to be used outside of core.
     */
    onLinkedTo(
        groupToListenTo: TLinkableGroup<TOptions, unknown, TTrait>,
        key?: IGroupLinkingKey<unknown, unknown>,
    ): void;
}