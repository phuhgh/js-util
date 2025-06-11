import { IGroupMembers } from "../entity-group-core-model.js";
import { DirtyCheckedUniqueCollection } from "../../collection/dirty-checked-unique-collection.js";

/**
 * @public
 * todo jack
 */
export class EntityGroupMembers<TTrait extends object> implements IGroupMembers<TTrait>
{
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
        return this.entities.reportingAdd(entity);
    }

    public remove(entity: TTrait): boolean
    {
        return this.entities.delete(entity);
    }

    private readonly entities = new DirtyCheckedUniqueCollection<TTrait>();
}