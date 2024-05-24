import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { IReferenceCounted } from "./a-reference-counted.js";
import { releaseRefs } from "./block-scoped-lifecycle.js";

/**
 * @public
 * RAII style shared object owner, otherwise like {@link blockScopedLifecycle} with `WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH`
 * set to `false`.
 *
 * @remark
 * Constructing this has the side effect of adding to the stack.
 */
export class BlockScopedLifecycle implements Disposable
{
    public constructor()
    {
        this.refs = lifecycleStack.push();
    }

    public [Symbol.dispose](): void
    {
        releaseRefs(this.refs);
        lifecycleStack.pop();
    }

    private readonly refs: IReferenceCounted[];
}