import { DirtyCheckedUniqueCollection, IDirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection";
import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted";
import { _Debug } from "../debug/_debug";

/**
 * @public
 * A reference counted object that can be nested.
 */
export interface ILinkedReferenceCounter extends IReferenceCounted
{
    linkRef(ref: IReferenceCounted): void;
    transferOwnership(ref: IReferenceCounted): void;
    unlinkRef(ref: IReferenceCounted): void;
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
        refs: IReferenceCounted[] = [],
    )
    {
        super();
        this.refs = new DirtyCheckedUniqueCollection<IReferenceCounted>(refs);

        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].claim();
        }
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

    public onFree(): void
    {
        const refs = this.refs.getArray();

        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].release();
        }

        this.refs.clear();
    }

    private refs: IDirtyCheckedUniqueCollection<IReferenceCounted>;
}