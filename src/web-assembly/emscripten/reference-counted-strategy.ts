import { type IManagedObject, type IManagedResourceNode, IPointer, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";
import { lifecycleStack } from "./lifecycle-stack.js";
import { ReferenceCountedNode } from "../../lifecycle/reference-counted-node.js";
import { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import { DebugSharedPointerChecks } from "../util/debug-shared-pointer-checks.js";
import type { IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import type { ILifecycleStrategy } from "./i-lifecycle-strategy.js";

/**
 * @public
 * The recommended lifecycle strategy. This strategy only adds debug checks for leaking objects; you must unlink
 * objects from their owners once they are finished with them.
 */
export class ReferenceCountedStrategy implements ILifecycleStrategy
{

    public createNode(owner: IManagedResourceNode | null): IManagedResourceNode
    {
        owner ??= lifecycleStack.getTop();
        const newNode = new ReferenceCountedNode();
        owner.getLinked().link(newNode);
        newNode.onReleased();
        return newNode;
    }

    /**
     * @internal
     */
    public createRootNode(): IManagedResourceNode
    {
        return new ReferenceCountedNode();
    }

    public onSharedPointerCreated
    (
        sharedPtr: IManagedObject & IPointer,
        metadata: PointerDebugMetadata,
        protectedView: IDebugProtectedViewFactory | null
    )
        : void
    {
        if (_BUILD.DEBUG)
        {
            DebugSharedPointerChecks.registerWithCleanup(this.wrapper, sharedPtr, metadata, protectedView);
            this.wrapper.debugUtils.sharedObjectLifeCycleChecks.registerFinalizationCheck(sharedPtr, metadata);
        }
    }

    public onManagedObjectCreated(object: IManagedObject): void
    {
        if (_BUILD.DEBUG)
        {
            this.wrapper.debugUtils.sharedObjectLifeCycleChecks.registerFinalizationCheck(object, null);
        }
    }

    /**
     * @internal
     */
    public setWrapper(wrapper: IEmscriptenWrapper<object>): void
    {
        this.wrapper = wrapper;
    }

    private wrapper!: IEmscriptenWrapper<object>;
}