import { DirtyCheckedUniqueCollection, IDirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection";
import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted";

/**
 * @public
 * A reference counted object that can be nested.
 */
export interface ILinkedReferenceCounter extends IReferenceCounted
{
    linkRef(ref: AReferenceCounted): void;
    unlinkRef(ref: AReferenceCounted): void;
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
        refs: AReferenceCounted[] = [],
    )
    {
        super();
        this.refs = new DirtyCheckedUniqueCollection<AReferenceCounted>(refs);

        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].claim();
        }
    }

    public linkRef(ref: AReferenceCounted): void
    {
        if (!this.refs.has(ref))
        {
            this.refs.add(ref);
            ref.claim();
        }
    }

    public unlinkRef(ref: AReferenceCounted): void
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

    private refs: IDirtyCheckedUniqueCollection<AReferenceCounted>;
}