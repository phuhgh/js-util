/**
 * @public
 */
export type TListener<TArgs extends unknown[]> = (...args:TArgs) => void;

/**
 * @public
 */
export interface IMulticastEvent<TArgs extends unknown[]>
{
    addListener(listener: TListener<TArgs>): void;
    removeListener(listener: TListener<TArgs>): void;
    emit(...args: TArgs): void;
}

/**
 * @public
 */
export class MulticastEvent<TArgs extends unknown[]> implements IMulticastEvent<TArgs>
{
    private readonly listeners = new Map<TListener<TArgs>, TListener<TArgs>>();

    public addListener(listener: TListener<TArgs>): void
    {
        this.listeners.set(listener, listener);
    }

    public removeListener(listener: TListener<TArgs>): void
    {
        this.listeners.delete(listener);
    }

    public emit(...args: TArgs): void
    {
        this.listeners.forEach(listener => listener(...args));
    }
}