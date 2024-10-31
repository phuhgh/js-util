import { type IManagedObject, type IManagedResourceNode, IPointer, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";
import { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import type { IEmscriptenWrapper } from "./i-emscripten-wrapper.js";

/**
 * @public
 * Defines the rules for how {@link IManagedObject}s should be cleaned up.
 */
export interface ILifecycleStrategy
{
    /**
     * Conceptually, there is always an owner. if you supply null, the resource is owned by a block scope; it is a
     * (debug) error to create a node without one or the other.
     */
    createNode(owner: IManagedResourceNode | null): IManagedResourceNode;
    /**
     * @internal
     */
    createRootNode(): IManagedResourceNode;

    onManagedObjectCreated(object: IManagedObject): void;
    onSharedPointerCreated(sharedPtr: IManagedObject & IPointer, metadata: PointerDebugMetadata, protectedViewFactory: IDebugProtectedViewFactory | null): void;

    /* @internal */
    setWrapper(wrapper: IEmscriptenWrapper<object>): void;
}