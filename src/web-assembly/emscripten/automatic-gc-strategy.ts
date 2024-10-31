import { type IManagedObject, type IManagedResourceNode, IPointer } from "../../lifecycle/manged-resources.js";
import type { ILifecycleStrategy } from "./i-lifecycle-strategy.js";
import { ReferenceCountedNode } from "../../lifecycle/reference-counted-node.js";
import { lifecycleStack } from "./lifecycle-stack.js";

/**
 * @public
 * Automatically releases handles when objects are garbage collected. The implementation relies on `FinalizationRegistry`,
 * which comes with a large number of health warnings, you probably shouldn't use it in production for anything important...
 *
 * Do not use this for testing of library functions, instead use {@link ReferenceCountedStrategy}.
 */
export class AutomaticGcStrategy implements ILifecycleStrategy
{
    public createNode(owner: IManagedResourceNode | null): IManagedResourceNode
    {
        // our reference counted node is a hybrid (there's no RAII...), so we have the object graph here
        // this means we don't need worry about pointer cycles, the JS garbage collector is doing the heavy lifting for us
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

    public onSharedPointerCreated(sharedPtr: IManagedObject & IPointer)
    {
        // this strategy doesn't require this extra metadata
        this.onManagedObjectCreated(sharedPtr);
    }

    public onManagedObjectCreated(object: IManagedObject): void
    {
        this.finalizationRegistry.register(object, object.resourceHandle);
    }

    /**
     * @internal
     */
    public setWrapper(): void
    {
        // not required...
    }

    private readonly finalizationRegistry = new FinalizationRegistry<IManagedResourceNode>((resourceHandle) =>
    {
        resourceHandle.onFreeChannel.emit();
        resourceHandle.getLinked().unlinkAll();
    });
}