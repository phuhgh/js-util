import type { ICleanupStore } from "./i-cleanup-store.js";
import { DirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";

/**
 * @public
 * Strong reference implementation of {@link ICleanupStore}.
 */
export class CleanupStore
    implements ICleanupStore
{
    public cleanup(): void
    {
        const cleanupCallbacks = this.cleanupCallbacks.getArray();

        for (let i = 0, iEnd = cleanupCallbacks.length; i < iEnd; i++)
        {
            cleanupCallbacks[i]();
        }

        this.cleanupCallbacks.clear();
    }

    public addCleanup(listener: () => void): void
    {
        this.cleanupCallbacks.add(listener);
    }

    public removeCleanup(listener: () => void): void
    {
        this.cleanupCallbacks.delete(listener);
    }

    public getCleaners(): readonly (() => void)[]
    {
        return this.cleanupCallbacks.getArray();
    }

    private readonly cleanupCallbacks = new DirtyCheckedUniqueCollection<() => void>();
}
