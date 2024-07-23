/**
 * @public
 * Represents a cleanup store that allows adding, removing, and executing cleanup callbacks.
 */
export interface ICleanupStore
{
    /**
     * Execute the cleanup code, then delete the cleanup callbacks (i.e. reset this object, ready to use again).
     */
    cleanup(): void;
    removeCleanup(cleanup: () => void): void;
    addCleanup(cleanup: () => void): void;
    getCleaners(): readonly (() => void)[];
}