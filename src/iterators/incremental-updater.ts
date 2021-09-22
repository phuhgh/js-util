/**
 * @public
 */
export interface IIncrementallyUpdatable
{
    incrementallyUpdate(): IterableIterator<void>;
}

/**
 * @public
 */
export interface IIncrementalUpdater
{
    /**
     * Remains true while update is suspended.
     */
    readonly isUpdating: boolean;
    beginUpdate(): void;
    cancel(): void;
    suspend(): void;
    resume(): void;
}

/**
 * @public
 */
export class IncrementalUpdater implements IIncrementalUpdater
{
    public isUpdating: boolean = false;

    public constructor
    (
        private updatable: IIncrementallyUpdatable,
        private waitPeriod: number = 4,
    )
    {
    }

    public beginUpdate(): void
    {
        this.cancel();
        this.isUpdating = true;
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

    public suspend(): void
    {
        if (this.id != null)
        {
            clearTimeout(this.id);
            this.id = null;
        }
    }

    public resume(): void
    {
        this.update();
    }

    private currentIterator: IterableIterator<unknown> | null = null;
    private id: number | null = null;
}

declare function clearTimeout(handle?: number): void;
declare function setTimeout(handler: () => void, timeout?: number, ...arguments: unknown[]): number;