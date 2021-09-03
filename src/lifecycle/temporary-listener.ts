/**
 * @public
 */
export interface ITemporaryListener<TArgs extends []>
{
    /**
     * Emits an event and then clears the listeners.
     */
    clearingEmit(...args: TArgs): void;
    emit(...args: TArgs): void;
    clearListeners(): void;

    initializeListener(callback: () => ((...args: TArgs) => void)): void;
    addListener(listener: (...args: TArgs) => void): void;
    getTargets(): readonly ((...args: TArgs) => void)[];
}

/**
 * @public
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
        const listenerCallback = this.listeners;

        for (let i = 0, iEnd = listenerCallback.length; i < iEnd; ++i)
        {
            listenerCallback[i](...args);
        }
    }

    public clearListeners(): void
    {
        this.listeners.length = 0;
    }

    public initializeListener(callback: () => ((...args: TArgs) => void)): void
    {
        this.listeners.push(callback());
    }

    public addListener(listener: (...args: TArgs) => void): void
    {
        this.listeners.push(listener);
    }

    public getTargets(): readonly ((...args: TArgs) => void)[]
    {
        return this.listeners;
    }

    private listeners: ((...args: TArgs) => void)[] = [];
}