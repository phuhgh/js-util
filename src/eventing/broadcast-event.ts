import { TListener } from "./t-listener";
import { IBroadcastEvent } from "./i-broadcast-event";
import { _Set } from "../set/_set";

/**
 * @public
 * Strong reference implementation of {@link IBroadcastEvent}.
 */
export class BroadcastEvent<TKey extends string, TArgs extends unknown[]> implements IBroadcastEvent<TKey, TArgs>
{
    public constructor
    (
        private key: TKey,
    )
    {
    }

    public addListener(listener: TListener<TKey, TArgs>): void
    {
        this.listeners.add(listener);
        this.cache = null;
    }

    public addTemporaryListener(listener: TListener<TKey, TArgs>): () => void
    {
        this.listeners.add(listener);
        this.cache = null;

        return () => this.removeListener(listener);
    }

    public addOneTimeListener(listener: TListener<TKey, TArgs>): void
    {
        const temporaryListener = {
            [this.key]: (...args: TArgs) => {
                this.removeListener(temporaryListener);
                return listener[this.key](...args);
            }
        } as TListener<TKey, TArgs>;

        this.addListener(temporaryListener);
    }

    public removeListener(listener: TListener<TKey, TArgs>): void
    {
        this.listeners.delete(listener);
        this.cache = null;
    }

    public emit(...args: TArgs): void
    {
        this.listeners.forEach(listener => listener[this.key](...args));
    }

    public getTargets(): readonly TListener<TKey, TArgs>[]
    {
        if (this.cache == null)
        {
            return this.cache = _Set.valuesToArray(this.listeners);
        }
        else
        {
            return this.cache;
        }
    }

    private readonly listeners = new Set<TListener<TKey, TArgs>>();
    private cache: TListener<TKey, TArgs>[] | null = null;
}
