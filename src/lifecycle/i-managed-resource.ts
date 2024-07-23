import type { IBroadcastChannel } from "../eventing/i-broadcast-channel.js";
import { BroadcastChannel } from "../eventing/broadcast-channel.js";

/**
 * @public
 * A listener for {@link IManagedResource}.
 */
export interface IOnFreeListener
{
    /**
     * Should be called once the resource has been freed.
     */
    onFree(): void;
}

/**
 * @public
 * Holds a handle to a resource that must be manually released.
 */
export interface IManagedResource
{
    readonly onFreeChannel: IBroadcastChannel<"onFree", []>;
    release(): void;
}

/**
 * @public
 * Event driven implementation of {@link IManagedResource}.
 */
export class AOnDestroy implements IManagedResource
{
    public readonly onFreeChannel: IBroadcastChannel<"onFree", []> = new BroadcastChannel("onFree");

    public release(): void
    {
        this.onFreeChannel.emit();
    }
}
