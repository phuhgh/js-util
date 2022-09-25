import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted.js";
import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";

/**
 * @public
 * A reference counted object
 */
export class ReferenceCountedOwner extends AReferenceCounted implements IReferenceCounted
{
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