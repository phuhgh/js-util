import { IGroupMembers } from "../entity-group-core-model.js";
import { fpNoOp } from "../../fp/impl/fp-no-op.js";
import { DirtyCheckedUniqueCollection } from "../../collection/dirty-checked-unique-collection.js";

/**
 * @public
 * todo jack: docs
 */
export class RefCountedGroupMembers<TTrait extends object>
    implements IGroupMembers<TTrait>
{
    public constructor
    (
        private readonly release: (entity: TTrait) => void = fpNoOp,
    )
    {
    }

    public getEntities(): readonly TTrait[]
    {
        return this.entities.getArray();
    }

    public isMember(entity: object): entity is TTrait
    {
        return this.entities.has(entity as TTrait);
    }

    public add(entity: TTrait): boolean
    {
        const count = 1 + (this.referenceCounts.get(entity) ?? 0);
        this.referenceCounts.set(entity, count);
        this.entities.add(entity);
        return count === 1;
    }

    public remove(entity: TTrait): boolean
    {
        const count = this.referenceCounts.get(entity) ?? 0;
        let removed = false;

        // decrementing will result in empty
        if (count === 1)
        {
            this.entities.delete(entity);
            this.referenceCounts.delete(entity);
            this.release(entity);
            removed = true;
        }
        else if (count !== 0)
        {
            this.referenceCounts.set(entity, count - 1);
        }

        return removed;
    }

    private readonly entities = new DirtyCheckedUniqueCollection<TTrait>();
    private readonly referenceCounts = new WeakMap<TTrait, number>();

}
