import { TListener } from "./t-listener.js";
import { ICleanupRegistry } from "../lifecycle/cleanup-registry.js";

/**
 * @public
 * Simple one to many communication channel. Proxies the arguments of emit to each listener.
 */
export interface IBroadcastChannel<TKey extends string, TArgs extends readonly unknown[]>
{
    addListener(listener: TListener<TKey, TArgs>): void;
    /**
     * Registers a cleanup callback on the supplied {@link ICleanupRegistry}.
     */
    addListener(store: ICleanupRegistry, listener: TListener<TKey, TArgs>): void;
    /**
     * Like `addListener` but unregisters after first event.
     */
    addOneTimeListener(listener: TListener<TKey, TArgs>): void;
    /**
     * Like `addListener` but unregisters after first or on cleanup, whichever comes first.
     */
    addOneTimeListener(store: ICleanupRegistry, listener: TListener<TKey, TArgs>): void;

    removeListener(listener: TListener<TKey, TArgs>): void;
    emit(...args: TArgs): void;
    getTargets(): readonly TListener<TKey, TArgs>[];
}