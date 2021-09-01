import { TListener } from "./t-listener";
import { IBroadcastEvent } from "./i-broadcast-event";

/**
 * @public
 * Strong reference implementation of {@link IBroadcastEvent}.
 */
export class BroadcastEvent<K extends string, TArgs extends unknown[]> implements IBroadcastEvent<K, TArgs>
{
    private readonly listeners = new Set<TListener<K, TArgs>>();

    public constructor
    (
        private key: K,
    )
    {
    }

    public addListener(listener: TListener<K, TArgs>): void
    {
        this.listeners.add(listener);
    }

    public addTemporaryListener(listener: TListener<K, TArgs>): () => void
    {
        this.listeners.add(listener);

        return () => this.removeListener(listener);
    }

    public removeListener(listener: TListener<K, TArgs>): void
    {
        this.listeners.delete(listener);
    }

    public emit(...args: TArgs): void
    {
        this.listeners.forEach(listener => listener[this.key](...args));
    }
}
