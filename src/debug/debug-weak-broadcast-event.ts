import { TListener } from "../eventing/t-listener";
import { IDebugWeakBroadcastEvent } from "rc-js-util-globals";

export class DebugWeakBroadcastEvent<K extends string,TArgs extends unknown[]> implements IDebugWeakBroadcastEvent<K,TArgs>
{
    public constructor
    (
        private readonly key: K,
    )
    {
    }

    public addListener(listener: TListener<K, TArgs>): void
    {
        const ref = new WeakRef(listener);
        this.listenersSet.add(ref);
        this.listenersMap.set(listener, ref);
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

    public removeListener(listener: TListener<K, TArgs>): void
    {
        const ref = this.listenersMap.get(listener);

        if (ref != null)
        {
            this.listenersSet.delete(ref);
        }
    }

    private readonly listenersSet = new Set<WeakRef<TListener<K, TArgs>>>();
    private readonly listenersMap = new WeakMap<TListener<K, TArgs>, WeakRef<TListener<K, TArgs>>>();
}
