import { TListener } from "./t-listener.js";
import type { ICleanupStore } from "../lifecycle/i-cleanup-store.js";

/**
 * @public
 * Simple one to many communication channel. Proxies the arguments of emit to each listener.
 */
export interface IBroadcastChannel<TKey extends string, TArgs extends readonly unknown[]>
{
    fromAnonymous(callback: (...args: TArgs) => void): TListener<TKey, TArgs>;

    addListener(listener: TListener<TKey, TArgs>): void;
    /**
     * Registers a cleanup callback on the supplied {@link ICleanupStore}.
     */
    addListener(store: ICleanupStore, listener: TListener<TKey, TArgs>): void;
    /**
     * Like `addListener` but unregisters after first event.
     */
    addOneTimeListener(listener: TListener<TKey, TArgs>): void;
    /**
     * Like `addListener` but unregisters after first or on cleanup, whichever comes first.
     */
    addOneTimeListener(store: ICleanupStore, listener: TListener<TKey, TArgs>): void;

    removeListener(listener: TListener<TKey, TArgs>): void;
    emit(...args: TArgs): void;
    getTargets(): readonly TListener<TKey, TArgs>[];
}