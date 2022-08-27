import { _Debug } from "../debug/_debug";

/**
 * @public
 * A provider that should return an iterator that represents a sequence of update operations. Useful for breaking up
 * operations that would block the UI for an unacceptably long time.
 */
export interface IIncrementallyUpdatable
{
    incrementallyUpdate(): IterableIterator<void>;
}

/**
 * @public
 * {@inheritDoc IncrementalUpdater}
 */
export interface IIncrementalUpdater
{
    readonly isUpdating: boolean;
    beginUpdate(): void;
    cancel(): void;
    suspend(): void;
    resume(): void;
}

/**
 * @public
 * Performs update operations once every `waitPeriod` until the iterator returned by {@link IIncrementallyUpdatable} is
 * exhausted.
 */
export class IncrementalUpdater implements IIncrementalUpdater
{
    /**
     * Remains true while the update is suspended.
     */
    public isUpdating: boolean = false;

    public constructor
    (
        private updatable: IIncrementallyUpdatable,
        private waitPeriod: number = 4,
    )
    {
    }

    /**
     * Cancel the update and clear the task.
     */
    public cancel(): void
    {
        if (this.id != null)
        {
            clearTimeout(this.id);
            this.id = null;
            this.isUpdating = false;
        }

        this.currentIterator = null;
    }

    /**
     * Suspends the current task if one is active.
     */
    public suspend(): void
    {
        if (this.id != null)
        {
            clearTimeout(this.id);
            this.id = null;
        }
    }

    /**
     * Start a new update cycle. If an update was already in progress it will be cancelled.
     */
    public beginUpdate(): void
    {
        this.cancel();
        this.isUpdating = true;
        this.update();
    }

    /**
     * Resumes the currently suspended task. It is an error to call this if there is not a currently suspended task.
     */
    public resume(): void
    {
        _BUILD.DEBUG && _Debug.assert(this.isUpdating && this.id == null, "nothing to resume");
        this.update();
    }

    private update = (): void =>
    {
        this.currentIterator ??= this.updatable.incrementallyUpdate();

        if (this.currentIterator.next().done === true)
        {
            this.currentIterator = null;
            this.id = null;
            this.isUpdating = false;
        }
        else
        {
            this.id = setTimeout(this.update, this.waitPeriod);
        }
    };

    private currentIterator: IterableIterator<unknown> | null = null;
    private id: number | null = null;
}

declare function clearTimeout(handle?: number): void;

declare function setTimeout(handler: () => void, timeout?: number, ...arguments: unknown[]): number;