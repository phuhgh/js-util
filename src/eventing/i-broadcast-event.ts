import { TListener } from "./t-listener";

/**
 * @public
 * Simple one to many communication channel. Proxies the arguments of emit to each listener.
 */
export interface IBroadcastEvent<TKey extends string, TArgs extends unknown[]>
{
    addListener(listener: TListener<TKey, TArgs>): void;
    /**
     * @returns a callback to unregister the listener.
     */
    addTemporaryListener(listener: TListener<TKey, TArgs>): () => void;
    /**
     * Like `addListener` but unregisters after first event.
     */
    addOneTimeListener(listener: TListener<TKey, TArgs>): void;
    removeListener(listener: TListener<TKey, TArgs>): void;
    emit(...args: TArgs): void;
    getTargets(): readonly TListener<TKey, TArgs>[];
}
