import { lifecycleStack } from "../emscripten/lifecycle-stack.js";
import { ILinkedReferenceCounter } from "../../lifecycle/linked-reference-counter.js";
import { IReferenceCounted } from "../../lifecycle/a-reference-counted.js";

/**
 * todo jack: tests
 * @public
 * Any shared objects allocated in the callback will be released on return. By default, these will be released on throw too.
 * In such event the error will be rethrown after releasing any shared objects.
 *
 * Error handling can be disabled by setting the build flag `WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH`.
 */
export function blockScopedLifecycle
(
    callback: () => void,
    linkTo?: ILinkedReferenceCounter,
)
    : void
{
    const refs = lifecycleStack.push();

    if (_BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH === true)
    {
        callback();
        link(refs, linkTo);
        lifecycleStack.pop();
    }
    else
    {
        try
        {
            callback();
            link(refs, linkTo);
        }
        finally
        {
            lifecycleStack.pop();
        }
    }
}

function link
(
    refs: IReferenceCounted[],
    linkedRef: ILinkedReferenceCounter | undefined,
)
    : void
{
    if (linkedRef == null)
    {
        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            refs[i].release();
        }
    }
    else
    {
        for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
        {
            linkedRef.transferOwnership(refs[i]);
        }
    }
}
