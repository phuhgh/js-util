import { TListener } from "../eventing/t-listener";
import { IDebugWeakBroadcastEvent } from "rc-js-util-globals";

export class DebugWeakBroadcastEvent<TKey extends string, TArgs extends unknown[]> implements IDebugWeakBroadcastEvent<TKey, TArgs>
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
