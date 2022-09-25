import { DirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";

/**
 * @public
 * Provides a communication channel via callbacks which can be easily cleared & copied.
 */
export interface ITemporaryListener<TArgs extends []>
{
    /**
     * Emits an event and then clears the listeners.
     */
    clearingEmit(...args: TArgs): void;
    emit(...args: TArgs): void;
    clearListeners(): void;
    removeListener(listener: (...args: TArgs) => void): void;

    initializeListener(callback: () => ((...args: TArgs) => void)): void;
    addListener(listener: (...args: TArgs) => void): void;
    getTargets(): readonly ((...args: TArgs) => void)[];
}

/**
 * @public
 * {@inheritDoc ITemporaryListener}
 */
export class TemporaryListener<TArgs extends []> implements ITemporaryListener<TArgs>
{
    public clearingEmit(...args: TArgs): void
    {
        this.emit(...args);
        this.clearListeners();
    }

    public emit(...args: TArgs): void
    {
        const listenerCallback = this.listeners.getArray();

        for (let i = 0, iEnd = listenerCallback.length; i < iEnd; ++i)
        {
            listenerCallback[i](...args);
        }
    }

    public clearListeners(): void
    {
        this.listeners.clear();
    }

    public initializeListener(callback: () => ((...args: TArgs) => void)): void
    {
        this.listeners.add(callback());
    }

    public addListener(listener: (...args: TArgs) => void): void
    {
        this.listeners.add(listener);
    }

    public removeListener(listener: (...args: TArgs) => void): void
    {
        this.listeners.delete(listener);
    }

    public getTargets(): readonly ((...args: TArgs) => void)[]
    {
        return this.listeners.getArray();
    }

    private listeners = new DirtyCheckedUniqueCollection<(...args: TArgs) => void>();
}