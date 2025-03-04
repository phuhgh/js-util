import type { IBroadcastChannel } from "../eventing/i-broadcast-channel.js";
import { type IManagedResourceLinks } from "./managed-resource-links.js";
import type { IEmscriptenWrapper } from "../web-assembly/emscripten/i-emscripten-wrapper.js";
import type { IInteropBindings } from "../web-assembly/emscripten/i-interop-bindings.js";

/**
 * @public
 * An object which has a pointer to some shared memory location.
 */
export interface IPointer
{
    pointer: number;
}

/**
 * @public
 * A listener for {@link IManagedResourceNode}.
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
 * Represents a resource that must be manually released. Each node (excluding the root node, provided by the wrapper)
 * should have one or more owners. When the owner is finished with the resource, they should unlink it; in the case
 * that all owners have dropped the reference, the resource is destroyed.
 *
 * You can create a node using {@link ILifecycleStrategy.createNode} (found on {@link IEmscriptenWrapper}.
 */
export interface IManagedResourceNode
{
    readonly onFreeChannel: IBroadcastChannel<"onFree", []>;

    getIsDestroyed(): boolean;
    getLinked(): IManagedResourceLinks;

    /**
     * @internal
     */
    onClaimed(byNode: IManagedResourceNode): void;
    /**
     * @internal
     */
    onReleased(byNode: IManagedResourceNode): void;
}

/**
 * @public
 * An object which is backed by some sort of shared resource, holds a handle to a {@link IManagedResourceNode}.
 */
export interface IManagedObject<TModule extends IInteropBindings = IInteropBindings>
{
    readonly resourceHandle: IManagedResourceNode;
    getWrapper(): IEmscriptenWrapper<TModule>;
}


/**
 * @public
 */
export class PointerDebugMetadata
{

    public constructor
    (
        public readonly address: number,
        public readonly isOwning: boolean,
        public readonly instanceName: string,
    )
    {
    }
}