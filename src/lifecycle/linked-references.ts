import { DirtyCheckedUniqueCollection, IDirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";
import { IReferenceCounted } from "./a-reference-counted.js";
import { _Debug } from "../debug/_debug.js";

/**
 * @public
 * Provides a mechanism reference counted objects to link to each other, respecting their lifecycles.
 */
export interface ILinkedReferences
{
    /**
     * Link the ref, incrementing their reference counter.
     */
    linkRef(ref: IReferenceCounted): ILinkedReferences;
    /**
     * Unlink the ref, decrement their reference counter.
     */
    unlinkRef(ref: IReferenceCounted): ILinkedReferences;
    /**
     * Unlink all refs, decrement their reference counters.
     */
    unlinkAllRefs(): void;

    /**
     * @returns the refs that this object is linking to.
     */
    refsToArray(): readonly IReferenceCounted[];
}

/**
 * @public
 * {@inheritDoc ILinkedReferences}
 */
export class LinkedReferences
    implements ILinkedReferences
{
    public constructor
    (
        ref: IReferenceCounted,
    )
    {
        this.ref = ref;
        this.refs = new DirtyCheckedUniqueCollection<IReferenceCounted>();
    }

    public linkRef(ref: IReferenceCounted): ILinkedReferences
    {
        if (!this.refs.has(ref))
        {
            if (_BUILD.DEBUG)
            {
                _Debug.assert(!DEBUG_getHasCycle(this.ref, ref), "detected cycle between references");
                _Debug.assert(!ref.getIsDestroyed() && !this.ref.getIsDestroyed(), "attempted to link to dead ref");
            }

            this.refs.add(ref);
            ref.claim();
        }

        return this;
    }

    public unlinkRef(ref: IReferenceCounted): ILinkedReferences
    {
        const removed = this.refs.delete(ref);

        if (removed)
        {
            ref.release();
        }

        return this;
    }

    public unlinkAllRefs(): void
    {
        this.clearRefs();
    }

    private clearRefs(): void
    {
        const refs = this.refs.getArray();

        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].release();
        }

        this.refs.clear();
    }

    public refsToArray(): readonly IReferenceCounted[]
    {
        return this.refs.getArray();
    }

    private refs: IDirtyCheckedUniqueCollection<IReferenceCounted>;
    private readonly ref: IReferenceCounted;
}

function DEBUG_getHasCycle(referencingTo: IReferenceCounted, referencingFrom: IReferenceCounted): boolean
{
    if (referencingTo === referencingFrom)
    {
        return true;
    }

    const refs = referencingFrom
        .getLinkedReferences()
        .refsToArray();

    for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
    {
        if (DEBUG_getHasCycle(referencingTo, refs[i]))
        {
            return true;
        }
    }

    return false;
}