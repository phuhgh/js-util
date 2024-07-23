import { TListener } from "./t-listener.js";
import { IBroadcastChannel } from "./i-broadcast-channel.js";
import { _Set } from "../set/_set.js";
import type { ICleanupStore } from "../lifecycle/i-cleanup-store.js";

/**
 * @public
 * Strong reference implementation of {@link IBroadcastChannel}.
 */
export class BroadcastChannel<TKey extends string, TArgs extends unknown[]>
    implements IBroadcastChannel<TKey, TArgs>
{
    public constructor
    (
        private key: TKey,
    )
    {
    }

    public fromAnonymous(callback: (...args: TArgs) => void): TListener<TKey, TArgs>
    {
        return {
            [this.key]: callback,
        } as TListener<TKey, TArgs>;
    }

    public addListener(listener: TListener<TKey, TArgs>): void;
    public addListener(store: ICleanupStore, listener: TListener<TKey, TArgs>): void;
    public addListener(maybeStore: ICleanupStore | TListener<TKey, TArgs>, listener?: TListener<TKey, TArgs>): void
    {
        if (listener == null)
        {
            // no store was supplied
            listener = maybeStore as TListener<TKey, TArgs>;
        }
        else
        {
            // we have both args
            (maybeStore as ICleanupStore).addCleanup(() => this.removeListener(listener as TListener<TKey, TArgs>));
        }
        this.listeners.add(listener);
        this.cache = null;
    }


    public addOneTimeListener(listener: TListener<TKey, TArgs>): void;
    public addOneTimeListener(store: ICleanupStore, listener: TListener<TKey, TArgs>): void;
    public addOneTimeListener(maybeStore: ICleanupStore | TListener<TKey, TArgs>, listener?: TListener<TKey, TArgs>): void
    {
        if (listener == null)
        {
            // no store was supplied
            listener = maybeStore as TListener<TKey, TArgs>;
        }

        const temporaryListener = {
            [this.key]: (...args: TArgs) =>
            {
                this.removeListener(temporaryListener);
                return listener[this.key](...args);
            }
        } as TListener<TKey, TArgs>;

        this.addListener(temporaryListener);

        if (listener != null)
        {
            (maybeStore as ICleanupStore).addCleanup(() => this.removeListener(temporaryListener));
        }
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
