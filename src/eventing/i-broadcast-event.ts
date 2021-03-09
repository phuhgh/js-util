import { TListener } from "./t-listener";

/**
 * @public
 * Simple one to many communication channel. Proxies the arguments of emit to each listener.
 */
export interface IBroadcastEvent<K extends string, TArgs extends unknown[]>
{
    addListener(listener: TListener<K, TArgs>): void;
    removeListener(listener: TListener<K, TArgs>): void;
    emit(...args: TArgs): void;
}
