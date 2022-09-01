import { TListener } from "../eventing/t-listener.js";
import { TDebugListener } from "./t-debug-listener.js";

/**
 * @public
 * Like {@link IBroadcastEvent} but without holding strong references. Available in debug contexts only.
 */
export interface IDebugWeakBroadcastEvent<K extends string, TArgs extends unknown[]>
{
    addListener(listener: TDebugListener<K, TArgs>): void;
    addTemporaryListener(listener: TDebugListener<K, TArgs>): () => void;
    removeListener(listener: TDebugListener<K, TArgs>): void;
    emit(...args: TArgs): void;
}

export class DebugWeakBroadcastEvent<TKey extends string, TArgs extends unknown[]>
    implements IDebugWeakBroadcastEvent<TKey, TArgs>
{
    public constructor
    (
        private readonly key: TKey,
    )
    {
    }

    public addListener(listener: TListener<TKey, TArgs>): void
    {
        this.removeListener(listener);

        const ref = new WeakRef(listener);
        this.listenersSet.add(ref);
        this.listenersMap.set(listener, ref);
    }

    public addTemporaryListener(listener: TListener<TKey, TArgs>): () => void
    {
        this.addListener(listener);

        return () => this.removeListener(listener);
    }

    public addOneTimeListener(listener: TListener<TKey, TArgs>): () => void
    {
        const temporaryListener = {
            [this.key]: (...args: TArgs) =>
            {
                this.removeListener(temporaryListener);
                return listener[this.key](...args);
            }
        } as TListener<TKey, TArgs>;

        this.addListener(temporaryListener);

        return () => this.removeListener(temporaryListener);
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
