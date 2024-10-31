import { TListener } from "../eventing/t-listener.js";
import { IBroadcastChannel } from "../eventing/i-broadcast-channel.js";

import type { ICleanupRegistry } from "../lifecycle/cleanup-registry.js";

/**
 * @public
 * Like {@link BroadcastChannel} but without holding strong references. Available in debug contexts only.
 */
export class DebugWeakBroadcastChannel<TKey extends string, TArgs extends unknown[]>
    implements IBroadcastChannel<TKey, TArgs>
{
    public constructor
    (
        private readonly key: TKey,
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

        this.removeListener(listener);

        const ref = new WeakRef(listener);
        this.listenersSet.add(ref);
        this.listenersMap.set(listener, ref);
    }

    public addOneTimeListener(listener: TListener<TKey, TArgs>): void;
    public addOneTimeListener(store: ICleanupRegistry, listener: TListener<TKey, TArgs>): void;
    public addOneTimeListener(maybeStore: ICleanupRegistry | TListener<TKey, TArgs>, listener?: TListener<TKey, TArgs>): void
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
            (maybeStore as ICleanupRegistry).registerCleanup(() => this.removeListener(temporaryListener));
        }
    }

    public emit(...args: TArgs): void
    {
        this.listenersSet.forEach(ref =>
        {
            const listener = ref.deref();

            if (listener == null)
            {
                this.listenersSet.delete(ref);
            }
            else
            {
                listener[this.key](...args);
            }
        });
    }

    public removeListener(listener: TListener<TKey, TArgs>): void
    {
        const ref = this.listenersMap.get(listener);

        if (ref != null)
        {
            this.listenersMap.delete(listener);
            this.listenersSet.delete(ref);
        }
    }

    public getTargets(): readonly TListener<TKey, TArgs>[]
    {
        const targets: TListener<TKey, TArgs>[] = [];

        this.listenersSet.forEach(ref =>
        {
            const listener = ref.deref();

            if (listener == null)
            {
                this.listenersSet.delete(ref);
            }
            else
            {
                targets.push(listener);
            }
        });

        return targets;
    }

    private readonly listenersSet = new Set<WeakRef<TListener<TKey, TArgs>>>();
    private readonly listenersMap = new WeakMap<TListener<TKey, TArgs>, WeakRef<TListener<TKey, TArgs>>>();
}
