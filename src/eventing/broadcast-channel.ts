import { TListener } from "./t-listener.js";
import { IBroadcastChannel } from "./i-broadcast-channel.js";
import { DirtyCheckedUniqueCollection } from "../collection/dirty-checked-unique-collection.js";
import type { ICleanupRegistry } from "../lifecycle/cleanup-registry.js";

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

    public addListener(listener: TListener<TKey, TArgs>): void;
    public addListener(store: ICleanupRegistry, listener: TListener<TKey, TArgs>): void;
    public addListener(maybeStore: ICleanupRegistry | TListener<TKey, TArgs>, listener?: TListener<TKey, TArgs>): void
    {
        if (listener == null)
        {
            // no store was supplied
            listener = maybeStore as TListener<TKey, TArgs>;
        }
        else
        {
            // we have both args
            (maybeStore as ICleanupRegistry).registerCleanup(() => this.removeListener(listener as TListener<TKey, TArgs>));
        }
        this.listeners.add(listener);
    }


    public addOneTimeListener(listener: TListener<TKey, TArgs>): void;
    public addOneTimeListener(store: ICleanupRegistry, listener: TListener<TKey, TArgs>): void;
    public addOneTimeListener(maybeStore: ICleanupRegistry | TListener<TKey, TArgs>, listener?: TListener<TKey, TArgs>): void
    {
        const hasStore = listener != null;
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

        if (hasStore)
        {
            (maybeStore as ICleanupRegistry).registerCleanup(() => this.removeListener(temporaryListener));
        }
    }

    public removeListener(listener: TListener<TKey, TArgs>): void
    {
        this.listeners.delete(listener);
    }

    public emit(...args: TArgs): void
    {
        const listeners = this.listeners.getArray();
        const key = this.key;

        for (let i = 0, iEnd = listeners.length; i < iEnd; i++)
        {
            listeners[i][key](...args);
        }
    }

    public getTargets(): readonly TListener<TKey, TArgs>[]
    {
        return this.listeners.getArray();
    }

    private readonly listeners = new DirtyCheckedUniqueCollection<TListener<TKey, TArgs>>();
}
