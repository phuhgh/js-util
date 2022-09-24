import { DirtyCheckedUniqueCollection, IDirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";
import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted.js";
import { _Debug } from "../debug/_debug.js";
import { arrayEmptyArray } from "../array/impl/array-empty-array.js";
import { blockScopedLifecycle } from "../web-assembly/util/block-scoped-lifecycle.js";
import { ITemporaryListener, TemporaryListener } from "./temporary-listener.js";

/**
 * @public
 * A reference counted object that can be nested.
 */
export interface ILinkedReferenceCounter extends IReferenceCounted
{
    /**
     * Link the ref, incrementing their reference counter.
     */
    linkRef(ref: IReferenceCounted): void;
    /**
     * Link the ref, do not increment their reference counter.
     */
    transferOwnership(ref: IReferenceCounted): void;
    /**
     * Unlink the ref, decrement their reference counter.
     */
    unlinkRef(ref: IReferenceCounted): void;
    /**
     * Unlink all refs, decrement their reference counters.
     */
    unlinkAllRefs(): void;

    /**
     * Call `transferOwnership` on any object allocated during the call. May be nested / combined with {@link blockScopedLifecycle},
     * objects are always bound to the top of the stack.
     */
    bindBlockScope<TRet>(callback: () => TRet): TRet;
    /**
     * Callback will be called when the reference count hits 0. Useful for cleanup.
     */
    registerOnFreeListener(callback: () => void): void;
}

/**
 * @public
 * {@inheritDoc ILinkedReferenceCounter}
 */
export class LinkedReferenceCounter
    extends AReferenceCounted
    implements ILinkedReferenceCounter
{
    public constructor
    (
        refs: readonly IReferenceCounted[] = arrayEmptyArray,
    )
    {
        super();
        this.refs = new DirtyCheckedUniqueCollection<IReferenceCounted>(refs);

        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].claim();
        }
    }

    public registerOnFreeListener(callback: () => void): void
    {
        this.onFreeListener = this.onFreeListener ?? new TemporaryListener();
        this.onFreeListener.addListener(callback);
    }

    public bindBlockScope<TRet>(callback: () => TRet): TRet
    {
        return blockScopedLifecycle(callback, this);
    }

    public transferOwnership(ref: IReferenceCounted): void
    {
        _BUILD.DEBUG && _Debug.assert(!this.refs.has(ref), "ref already added");
        this.refs.add(ref);
    }

    public linkRef(ref: IReferenceCounted): void
    {
        if (!this.refs.has(ref))
        {
            this.refs.add(ref);
            ref.claim();
        }
    }

    public unlinkRef(ref: IReferenceCounted): void
    {
        const removed = this.refs.delete(ref);

        if (removed)
        {
            ref.release();
        }
    }

    public unlinkAllRefs(): void
    {
        this.clearRefs();
    }

    protected onFree(): void
    {
        this.clearRefs();
        this.onFreeListener?.emit();
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

    private refs: IDirtyCheckedUniqueCollection<IReferenceCounted>;
    private onFreeListener: ITemporaryListener<[]> | null = null;
}