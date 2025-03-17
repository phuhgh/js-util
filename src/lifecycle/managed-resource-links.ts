import { DirtyCheckedUniqueCollection, IDirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";
import { _Debug } from "../debug/_debug.js";
import type { IManagedResourceNode } from "./manged-resources.js";

/**
 * @public
 * Provides a mechanism for reference counted objects to link to each other, respecting their lifecycles.
 */
export interface IManagedResourceLinks
{
    isLinkedTo(ref: IManagedResourceNode): boolean;
    /**
     * Link this node to `ref`, i.e. this node owns `ref`.
     */
    link(ref: IManagedResourceNode): IManagedResourceLinks;
    unlink(ref: IManagedResourceNode): IManagedResourceLinks;
    unlinkAll(): void;
    getLinkedNodes(): readonly IManagedResourceNode[];
}

/**
 * @internal
 */
export class ManagedResourceLinks
    implements IManagedResourceLinks
{
    public constructor
    (
        private readonly owningRef: IManagedResourceNode,
    )
    {
        this.linkedTo = new DirtyCheckedUniqueCollection<IManagedResourceNode>();
    }

    public isLinkedTo(ref: IManagedResourceNode): boolean
    {
        return this.linkedTo.has(ref);
    }

    public link(ref: IManagedResourceNode): IManagedResourceLinks
    {
        if (!this.linkedTo.has(ref))
        {
            if (_BUILD.DEBUG)
            {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (!_BUILD.WASM_DISABLE_CYCLE_CHECKS)
                {
                    _Debug.assert(!DEBUG_getHasCycle(this.owningRef, ref), "detected cycle between references");
                }
                _Debug.assert(!ref.getIsDestroyed() && !this.owningRef.getIsDestroyed(), "attempted to link to dead ref");
            }

            this.linkedTo.add(ref);
            ref.onClaimed(this.owningRef);
        }

        return this;
    }

    public unlink(ref: IManagedResourceNode): IManagedResourceLinks
    {
        const removed = this.linkedTo.delete(ref);

        if (removed)
        {
            ref.onReleased(this.owningRef);
        }

        return this;
    }

    public unlinkAll(): void
    {
        this.clearRefs();
    }

    private clearRefs(): void
    {
        const refs = this.linkedTo.getArray();
        const ref = this.owningRef;

        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].onReleased(ref);
        }

        this.linkedTo.clear();
    }

    public getLinkedNodes(): readonly IManagedResourceNode[]
    {
        return this.linkedTo.getArray();
    }

    private linkedTo: IDirtyCheckedUniqueCollection<IManagedResourceNode>;
}

function DEBUG_getHasCycle(referencingTo: IManagedResourceNode, referencingFrom: IManagedResourceNode): boolean
{
    if (referencingTo === referencingFrom)
    {
        return true;
    }

    const refs = referencingFrom
        .getLinked()
        .getLinkedNodes();

    for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
    {
        if (DEBUG_getHasCycle(referencingTo, refs[i]))
        {
            return true;
        }
    }

    return false;
}