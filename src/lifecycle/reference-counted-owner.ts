import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted.js";
import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { ILinkedReferences } from "./linked-references.js";

/**
 * @public
 * A reference counted object.
 */
export class ReferenceCountedOwner extends AReferenceCounted implements IReferenceCounted
{
    /**
     * Creates a ReferenceCountedOwner bound to `bindToReference`. By default, block scoped is disabled.
     */
    public static createOneBound
    (
        bindToReference: ILinkedReferences,
        blockScoped: boolean = false,
    )
        : IReferenceCounted
    {
        const ref = new ReferenceCountedOwner(blockScoped);
        bindToReference.linkRef(ref);

        if (!blockScoped)
        {
            ref.release();
        }

        return ref;
    }

    public constructor(
        blockScoped: boolean = true,
    )
    {
        super();

        if (blockScoped)
        {
            lifecycleStack.register(this);
        }
    }
}