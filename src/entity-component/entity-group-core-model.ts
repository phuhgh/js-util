import { IGroupLinkingKey } from "./i-linked-entity-groups.js";
import type { IEventService } from "./event-service.js";

/**
 * @public
 * The "attributes" of an entity group - the specific data or functionality associated with the group.
 */
export interface IEntityGroupAttributes<TAttributes>
{
    attributes: TAttributes;
}

// todo jack: you might be able to hide this interface now, externals really don't need to know about this...
/**
 * @public
 * Provides the entities present in an {@link IEntityGroup}.
 */
export interface IGroupMembers<TTrait>
{
    isMember(entity: unknown): entity is TTrait;
    getEntities(): readonly TTrait[];

    /**
     * @internal
     * External users should always go through the entity group for add and remove operations.
     */
    add(entity: TTrait): boolean;
    /**
     * @internal
     * External users should always go through the entity group for add and remove operations.
     */
    remove(entity: TTrait): boolean;
}

// todo jack:11 unit tests (add compile checks for entity)
/**
 * @public
 * @summary A group of entities that implement `TTrait`. Allows linking of structurally compatible groups, so that entities added to one can be automatically added and removed to those linked groups.
 * @remark Adding of entities can only be done in interface extensions (because of type correctness reasons).
 */
export interface IEntityGroup<TAttributes, TTrait>
{
    readonly members: IGroupMembers<TTrait>;
    readonly attributes: TAttributes;
    // todo jack23: very possibly redundant after implementing hierarchical events - it was basically used to do strong typing before...
    readonly eventService: IEventService;

    /**
     * Groups that are broadcast to.
     */
    getGroupsLinkedTo(): readonly IEntityGroup<unknown, TTrait>[];
    /**
     * Groups that are broadcast to.
     */
    getGroupsLinkedTo<TLinkedAttributes, TKeyTrait>
    (
        key?: IGroupLinkingKey<TLinkedAttributes, TKeyTrait>,
    )
        : readonly IEntityGroup<TLinkedAttributes, TTrait & TKeyTrait>[];

    /**
     * Groups that this group listens to.
     */
    getGroupsLinkedFrom(): readonly IEntityGroup<unknown, TTrait>[];
    /**
     * Groups that this group listens to.
     */
    getGroupsLinkedFrom<TLinkedAttributes, TKeyTrait>
    (
        key?: IGroupLinkingKey<TLinkedAttributes, TKeyTrait>,
    )
        : readonly IEntityGroup<TLinkedAttributes, TTrait & TKeyTrait>[];

    removeEntity(entity: TTrait): boolean;
}


/**
 * @public
 * Provides hooks for tracking membership of groups.
 */
export interface IOnGroupChange<TOptions, TTrait>
{
    onEntityAdded(entity: TTrait, options: TOptions): void;
    onEntityRemoved(entity: TTrait): void;

    // todo jack: what was this for?
    /**
     * Where the group members are required (e.g. tracking updates), this can be acquired during initialization by implementing this method.
     */
    forwardRefMembers?(members: IGroupMembers<TTrait>): void;
}