import { _Debug } from "../../debug/_debug.js";
import { getGlobal } from "../../runtime/get-global.js";
import type { IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import { arrayMap } from "../../array/impl/array-map.js";
import { IManagedResourceLinks, ManagedResourceLinks } from "../../lifecycle/managed-resource-links.js";
import type { IBroadcastChannel } from "../../eventing/i-broadcast-channel.js";
import { BroadcastChannel } from "../../eventing/broadcast-channel.js";

export class LifecycleStack
{
    public constructor()
    {
        const existingOwners = getGlobal()["RC_ALLOCATION_OWNER_STACK"] as IManagedResourceNode[] | undefined;
        this.ownerStack = existingOwners ?? arrayMap(new Array<IManagedResourceNode[]>(128), () => new BlockScopeNode());
    }

    public push(): IManagedResourceNode
    {
        if (_BUILD.DEBUG)
        {
            _Debug.assert(this.index < 128, "overflowed the allocation stack...");
        }

        return this.ownerStack[this.index++];
    }

    public pop(): IManagedResourceNode
    {
        _BUILD.DEBUG && _Debug.assert(this.index > 0, "attempted to pop empty stack");
        return this.ownerStack[--this.index];
    }

    /**
     * For the current level, return the owning node.
     */
    public getTop(): IManagedResourceNode
    {
        _BUILD.DEBUG && _Debug.assert(this.index > 0, "tried to get top of empty stack");
        return this.ownerStack[this.index - 1];
    }

    public getSize(): number
    {
        return this.index;
    }

    private readonly ownerStack: IManagedResourceNode[];
    private index: number = 0;
}


/**
 * @internal
 * The block scoped node is mostly the same as other nodes, except they live forever (when a scope is exited
 * we just unlink the refs).
 */
class BlockScopeNode implements IManagedResourceNode
{
    public readonly onFreeChannel: IBroadcastChannel<"onFree", []> = new BroadcastChannel("onFree");

    public getIsDestroyed(): boolean
    {
        return false;
    }

    public getLinked(): IManagedResourceLinks
    {
        return this.linkedReferences;
    }

    public onClaimed(): void
    {
        _BUILD.DEBUG && _Debug.error("this should never be called");
    }

    public onReleased(): void
    {
        _BUILD.DEBUG && _Debug.error("this should never be called");
    }

    // we always have linked nodes, so no reason to lazy create this
    protected linkedReferences: IManagedResourceLinks = new ManagedResourceLinks(this);
}


/**
 * @public
 */
export const lifecycleStack = new LifecycleStack();
