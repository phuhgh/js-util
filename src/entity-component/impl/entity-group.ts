import { LinkingGroupMembershipHooks } from "./linking-group-membership-hooks.js";
import { NoOpOnGroupChange } from "./no-op-on-group-change.js";
import { EntityGroupMembers } from "./entity-group-members.js";
import { IEntityGroup, IGroupMembers, IOnGroupChange } from "../entity-group-core-model.js";
import { IGroupLinkingKey, ILinkedEntityGroups } from "../i-linked-entity-groups.js";
import { IManagedObject, type IManagedResourceNode, type IOnFreeListener, type IPointer, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";
import type { IEntityGroupBindings } from "../i-entity-group-bindings.js";
import type { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper.js";
import { nullPtr } from "../../web-assembly/emscripten/null-pointer.js";
import { _Production } from "../../production/_production.js";
import type { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import type { IInteropBindings } from "../../web-assembly/emscripten/i-interop-bindings.js";
import { EventService, type IEventService } from "../event-service.js";
import { onEntityAddedToGroup } from "../events/on-entity-added-to-group.js";
import { _Debug } from "../../debug/_debug.js";
import { onEntityRemovedFromGroup } from "../events/on-entity-removed-from-group.js";


/**
 * todo jack:  what I would like...
 * - not need to define a group twice (shared vs not)
 * - be able to access those entities in the group in a standardized way if shared
 * - (probably) to chose a restriction of either one or the other but not both?
 *
 * REQUIREMENTS:
 * - if it supports shared, we need the wrapper when we construct the group
 *
 * QUESTIONS:
 * - how will this work with templating? It should mostly just work I would guess...
 *
 * PLAN:
 * - if we get a wrapper, provide some basic API on either the group OR attributes
 * - impose restriction that entity comes with managed object interface
 */
// todo jack: bin this off, use the one form jsutil...

// todo jack: rename me, you might want to just extend the mnaged object interface, but... dunno
// export interface IManagedEntity<TModule extends IInteropBindings> extends IManagedObject<TModule>
// {
//     managedObject: IManagedObject<TModule>;
//     onAddedToGroup: (owner: IManagedObject<TModule>) => void;
//     onRemovedFromGroup: (owner: IManagedObject<TModule>) => void;
// }

// todo jack20: it's valuable to be able to remove an entity from all groups, that part we should probably reimplement...
/**
 * @public
 * In order to express relationships like "system graphics extensions must be a superset of component graphics extensions", we need to jump through some hoops as
 * we can't just say that the type must be contravariant (super type).
 */
export type TEntityGroupValidator<TUserOpts, TOptions, TTrait>
    = (userOptions: TUserOpts, specification: TOptions, entity: TTrait) => void;

/**
 * @public
 */
export type TLinkableGroup<TOptions, TAttributes, TTrait> =
    | TSubsetEntityGroup<TOptions, TAttributes, TTrait>
    | TSupersetEntityGroup<TOptions, TAttributes, TTrait>
    ;

export interface ISubsetEntityGroupImpl<TOptions, TTrait>
{
    // todo jack13: overly verbose, "links"
    readonly linkedGroups: ILinkedEntityGroups<TOptions, TTrait>;

    /**
     * @returns true if the entity was added.
     */
    addEntity
    (
        entity: TTrait,
        options: TOptions,
    )
        : boolean;

    readonly TOptions: TOptions;
}

/**
 * @public
 * todo jack - the covariant one
 */
export type TSubsetEntityGroup<TOptions, TAttributes, TTrait>
    = IEntityGroup<TAttributes, TTrait>
    & (TTrait extends (IManagedObject & IPointer) ? IManagedObject : {})
    & ISubsetEntityGroupImpl<TOptions, TTrait>;


export interface ISupersetEntityGroupImpl<TOptions, TTrait>
{
    readonly linkedGroups: ILinkedEntityGroups<TOptions, TTrait>;
    /**
     * @returns true if the entity was added.
     */
    addEntity<TUserOptions, TEntity extends TTrait>
    (
        entity: TTrait & TEntity,
        options: TUserOptions,
        validate: TEntityGroupValidator<TUserOptions, TOptions, TEntity>,
    )
        : boolean;

    readonly TOptions: TOptions;
}

// export function createManagedEntity<TTrait extends {}>():

export class ManagedEntity<TBindings extends IEntityGroupBindings = IEntityGroupBindings>
    implements IManagedObject,
               IPointer
{
    public readonly pointer: number;
    public readonly resourceHandle: IManagedResourceNode;

    public constructor
    (
        wrapper: IEmscriptenWrapper<TBindings>,
        owner: IManagedResourceNode | null,
    )
    {
        this.wrapper = wrapper;
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.pointer = wrapper.instance._vtCreateEntity();
        if (this.pointer == nullPtr)
        {
            // todo jack: use the appropriate error
            throw _Production.createError("Failed to allocate memory for shared array.");
        }
        this.cleanup = new SharedObjectCleanup(this, "ManagedEntity", null);
        this.resourceHandle.onFreeChannel.addListener(this.cleanup); // todo jack: use the static method
    }

    public getWrapper(): IEmscriptenWrapper<TBindings>
    {
        return this.wrapper;
    }

    private readonly wrapper: IEmscriptenWrapper<TBindings>;
    private readonly cleanup: SharedObjectCleanup;
}

// todo jack: use the one in JsUtil
class SharedObjectCleanup implements IOnFreeListener
{
    public constructor
    (
        sharedObject: IManagedObject & IPointer,
        debugName: string,
        protectedView: IDebugProtectedViewFactory | null,
    )
    {
        this.wrapper = sharedObject.getWrapper();
        this.ptr = sharedObject.pointer;
        this.wrapper.lifecycleStrategy.onSharedPointerCreated(sharedObject, new PointerDebugMetadata(this.ptr, true, debugName), protectedView);
    }

    public onFree(): void
    {
        this.wrapper.instance._jsUtilDeleteObject(this.ptr);
    }

    private readonly wrapper: IEmscriptenWrapper<IInteropBindings>;
    private readonly ptr: number;
}

/**
 * @public
 * @summary Allows validations of contravariant options (i.e. must be super types) by taking a validator function on {@link addEntity}.
 * See {@link TEntityGroupValidator} for rationale.
 * @remark Refer to documentation of the group to get the validator function.
 *
 * todo jack: rework docks - the contravariant one
 * The group must provide a superset of the requirements of TOptions
 */
export type TSupersetEntityGroup<TOptions, TAttributes, TTrait>
    =
    & IEntityGroup<TAttributes, TTrait>
    & (TTrait extends (IManagedObject & IPointer) ? IManagedObject : {})
    & ISupersetEntityGroupImpl<TOptions, TTrait>;

// todo jack: hide this behind a factory function
/**
 * @internal
 * Provides an implementation for both {@link TSubsetEntityGroup} and {@link TSupersetEntityGroup}.
 * @remark `resourceHandle` is conditionally defined (contrary to the interface), hide this class behind the appropriate interface...
 */
export class EntityGroup<TOptions, TAttributes, TTrait extends object>
    implements IEntityGroup<TAttributes, TTrait>,
               ISubsetEntityGroupImpl<TOptions, TTrait>,
               ISupersetEntityGroupImpl<TOptions, TTrait>,
               IManagedObject,
               IPointer
{
    public readonly pointer: number = nullPtr;
    public readonly resourceHandle!: IManagedResourceNode;
    public readonly attributes: TAttributes;
    public readonly members: IGroupMembers<TTrait>;
    public readonly linkedGroups: LinkingGroupMembershipHooks<TOptions, TTrait>;
    public readonly eventService: IEventService = new EventService();

    public constructor
    (
        attributes: TAttributes,
        groupHooks: IOnGroupChange<TOptions, TTrait> = new NoOpOnGroupChange(),
        members: IGroupMembers<TTrait> = new EntityGroupMembers<TTrait>(),
        wrapper: IEmscriptenWrapper<IEntityGroupBindings> | null = null,
        owner: IManagedResourceNode | null = null,
    )
    {
        this.attributes = attributes;
        this.members = members;
        this.groupHooks = groupHooks;
        this.linkedGroups = new LinkingGroupMembershipHooks<TOptions, TTrait>(this);
        this.wrapper = wrapper ?? null;

        if (wrapper != null)
        {
            this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
            this.pointer = wrapper.instance._vtCreateGroup();
            if (this.pointer == nullPtr)
            {
                // todo jack: throw a proper allocation failure
                throw new Error("todo jack...");
            }

            this.cleanup = new SharedObjectCleanup(this, "EntityGroup", null); // todo jack: use the static method
            this.resourceHandle.onFreeChannel.addListener(this.cleanup);
        }

        if (groupHooks.forwardRefMembers != null)
        {
            groupHooks.forwardRefMembers(members);
        }
    }

    public addEntity<TUserOpts, TTrait, TPlotTrait>
    (
        entity: NoInfer<TPlotTrait> & TTrait,
        options: TUserOpts,
        validator?: TEntityGroupValidator<TUserOpts, TOptions, TTrait>,
    )
        : boolean;
    public addEntity<TPlotTrait>(entity: NoInfer<TPlotTrait> & TTrait, options: TOptions): boolean;
    public addEntity(entity: TTrait, options: TOptions): boolean
    {
        const entityAdded = this.members.add(entity);

        if (entityAdded)
        {
            this.groupHooks.onEntityAdded(entity, options);
            this.linkedGroups.onEntityAdded(entity, options);
            onEntityAddedToGroup.emit(this.eventService, entity);

            if (this.wrapper != null)
            {
                // noinspection SuspiciousTypeOfGuard
                _BUILD.DEBUG && _Debug.assert(typeof ((entity as IPointer).pointer) === "number", "expected pointer");
                this.wrapper.instance._vtAddEntityToGroup(this.pointer, (entity as IManagedObject & IPointer).pointer);
                this.resourceHandle.getLinked().link((entity as IManagedObject).resourceHandle);
            }
        }

        return entityAdded;
    }

    public removeEntity(entity: TTrait): boolean
    {
        const entityRemoved = this.members.remove(entity);

        if (entityRemoved)
        {
            this.groupHooks.onEntityRemoved(entity);
            this.linkedGroups.onEntityRemoved(entity);
            onEntityRemovedFromGroup.emit(this.eventService, entity);

            if (this.wrapper != null)
            {
                // noinspection SuspiciousTypeOfGuard
                _BUILD.DEBUG && _Debug.assert(typeof ((entity as IPointer).pointer) === "number", "expected pointer");
                this.wrapper.instance._vtRemoveEntityFromGroup(this.pointer, (entity as IManagedObject & IPointer).pointer);
                this.resourceHandle.getLinked().unlink((entity as IManagedObject).resourceHandle);
            }
        }

        return entityRemoved;
    }

    public getGroupsLinkedTo<TLinkedAttributes, TTrait>
    (
        key?: IGroupLinkingKey<TLinkedAttributes, TTrait>,
    )
        : readonly IEntityGroup<TLinkedAttributes, TTrait>[]
    {
        return this.linkedGroups.getGroupsLinkingTo(key);
    }

    public getGroupsLinkedFrom<TLinkedAttributes, TTrait>
    (
        key?: IGroupLinkingKey<TLinkedAttributes, TTrait>,
    )
        : readonly IEntityGroup<TLinkedAttributes, TTrait>[]
    {
        return this.linkedGroups.getGroupsLinkingFrom(key);
    }

    public getWrapper(): IEmscriptenWrapper<IInteropBindings>
    {
        _BUILD.DEBUG && _Debug.assert(this.wrapper != null, "tried to ask for wrapper for entity group which is not shared...");
        return this.wrapper!;
    }

    public readonly TOptions!: TOptions;
    private readonly groupHooks: IOnGroupChange<TOptions, TTrait>;
    private readonly wrapper: IEmscriptenWrapper<IEntityGroupBindings> | null;
    private readonly cleanup!: SharedObjectCleanup;
}
