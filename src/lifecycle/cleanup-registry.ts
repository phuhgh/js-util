import { DirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";

/**
 * @public
 * Represents a store that allows adding, removing, and executing cleanup callbacks.
 */
export interface ICleanupRegistry
{
    /**
     * Execute the cleanup code, then delete the cleanup callbacks (i.e. reset this object, ready to use again).
     */
    executeCleanups(): void;
    unregisterCleanup(cleanup: () => void): void;
    registerCleanup(cleanup: () => void): void;
    listCleanups(): readonly (() => void)[];
}

/**
 * @public
 * Strong reference implementation of {@link ICleanupRegistry}.
 */
export class CleanupRegistry
    implements ICleanupRegistry
{
    public executeCleanups(): void
    {
        const cleanupCallbacks = this.cleanupCallbacks.getArray();

        for (let i = 0, iEnd = cleanupCallbacks.length; i < iEnd; i++)
        {
            cleanupCallbacks[i]();
        }

        this.cleanupCallbacks.clear();
    }

    public registerCleanup(listener: () => void): void
    {
        this.cleanupCallbacks.add(listener);
    }

    public unregisterCleanup(listener: () => void): void
    {
        this.cleanupCallbacks.delete(listener);
    }

    public listCleanups(): readonly (() => void)[]
    {
        return this.cleanupCallbacks.getArray();
    }

    private readonly cleanupCallbacks = new DirtyCheckedUniqueCollection<() => void>();
}
