import { IDebugWeakBroadcastEvent, TDebugListener } from "@rc-js-util/globals";

export class DebugWeakBroadcastEvent<TKey extends string, TArgs extends unknown[]> implements IDebugWeakBroadcastEvent<TKey, TArgs>
{
    public constructor
    (
        private readonly key: TKey,
    )
    {
    }

    public addListener(listener: TDebugListener<TKey, TArgs>): void
    {
        this.removeListener(listener);

        const ref = new WeakRef(listener);
        this.listenersSet.add(ref);
        this.listenersMap.set(listener, ref);
    }

    public addTemporaryListener(listener: TDebugListener<TKey, TArgs>): () => void
    {
        this.addListener(listener);

        return () => this.removeListener(listener);
    }

    public addOneTimeListener(listener: TDebugListener<TKey, TArgs>): () => void
    {
        const temporaryListener = {
            [this.key]: (...args: TArgs) =>
            {
                this.removeListener(temporaryListener);

                const method = listener[this.key];

                if (method != null)
                {
                    method.apply(listener, args);
                }
            },
        } as TDebugListener<TKey, TArgs>;

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
                const method = listener[this.key];

                if (method != null)
                {
                    method.apply(listener, args);
                }
            }
        });
    }

    public removeListener(listener: TDebugListener<TKey, TArgs>): void
    {
        const ref = this.listenersMap.get(listener);

        if (ref != null)
        {
            this.listenersMap.delete(listener);
            this.listenersSet.delete(ref);
        }
    }

    public getTargets(): readonly Required<TDebugListener<TKey, TArgs>>[]
    {
        const targets: Required<TDebugListener<TKey, TArgs>>[] = [];

        this.listenersSet.forEach(ref =>
        {
            const listener = ref.deref();

            if (listener == null)
            {
                this.listenersSet.delete(ref);
            }
            else if (listener[this.key] != null)
            {
                targets.push(listener as Required<TDebugListener<TKey, TArgs>>);
            }
        });

        return targets;
    }

    private readonly listenersSet = new Set<WeakRef<TDebugListener<TKey, TArgs>>>();
    private readonly listenersMap = new WeakMap<TDebugListener<TKey, TArgs>, WeakRef<TDebugListener<TKey, TArgs>>>();
}
