/**
 * @public
 */
export interface ITemporaryListener<TArg>
{
    /**
     * Emits an event and then clears the listeners.
     */
    clearingEmit(arg: TArg): void;
    emit(arg: TArg): void;
    clearListeners(): void;

    initializeListener(callback: () => ((arg: TArg) => void)): void;
    addListener(listener: (arg: TArg) => void): void;
}

/**
 * @public
 */
export class TemporaryListener<TArg> implements ITemporaryListener<TArg>
{
    public clearingEmit(arg: TArg): void
    {
        this.emit(arg);
        this.clearListeners();
    }

    public emit(arg: TArg): void
    {
        const listenerCallback = this.listeners;

        for (let i = 0, iEnd = listenerCallback.length; i < iEnd; ++i)
        {
            listenerCallback[i](arg);
        }
    }

    public clearListeners(): void
    {
        this.listeners.length = 0;
    }

    public initializeListener(callback: () => ((arg: TArg) => void)): void
    {
        this.listeners.push(callback());
    }

    public addListener(listener: (arg: TArg) => void): void
    {
        this.listeners.push(listener);
    }

    private listeners: ((arg: TArg) => void)[] = [];
}