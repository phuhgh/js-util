import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { IReferenceCounted } from "./a-reference-counted.js";

/**
 * @public
 * Any shared objects allocated in the callback will be released on return. By default, these will be released on throw too.
 * In such event the error will be rethrown after releasing any shared objects.
 *
 * Error handling can be disabled by setting the build flag `WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH`.
 */
export function blockScopedLifecycle<TRet>
(
    callback: () => TRet,
)
    : TRet
{
    const refs = lifecycleStack.push();
    let ret: TRet | undefined;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (_BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH)
    {
        ret = callback();
        releaseRefs(refs);
        lifecycleStack.pop();
    }
    else
    {
        try
        {
            ret = callback();
            releaseRefs(refs);
        }
        finally
        {
            lifecycleStack.pop();
        }
    }

    return ret;
}

function releaseRefs
(
    refs: IReferenceCounted[],
)
    : void
{
    for (let i = 0, iEnd = refs.length; i < iEnd; ++i)
    {
        refs[i].release();
    }
}
