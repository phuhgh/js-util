import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { _Debug } from "../debug/_debug.js";


/**
 * @public
 * Any shared objects allocated in the callback will be released on return. By default, these will be released on throw too.
 * In such event the error will be rethrown after releasing any shared objects.
 *
 * Error handling can be disabled by setting the build flag `WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH`.
 */
export function blockScope<TRet>
(
    callback: () => TRet
)
    : TRet
{
    const blockScopedNode = lifecycleStack.push();
    let ret: TRet | undefined;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (_BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH)
    {
        ret = callback();
        blockScopedNode.getLinked().unlinkAll();
        lifecycleStack.pop();
    }
    else
    {
        try
        {
            ret = callback();
        }
        finally
        {
            blockScopedNode.getLinked().unlinkAll();
            lifecycleStack.pop();
        }
    }

    // you need to be very careful about ordering... block scope probably isn't appropriate for this
    _BUILD.DEBUG && _Debug.assert(!(ret instanceof Promise), "found promise, this is not supported");

    return ret;
}
