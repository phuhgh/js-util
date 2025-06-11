import { IOnGroupChange } from "../entity-group-core-model.js";

/**
 * @public
 * A {@link IOnGroupChange} that does nothing when entities are added or removed.
 */
export class NoOpOnGroupChange implements IOnGroupChange<object, unknown>
{
    public onEntityRemoved(): void
    {
        // do nothing
    }

    public onEntityAdded(): void
    {
        // do nothing
    }
}