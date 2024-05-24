import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { IReferenceCounted } from "./a-reference-counted.js";

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

/**
 * @public
 * Behaves like {@link blockScopedLifecycle}, but instead of being called immediately, it returns a callback which can
 * be invoked later.
 */
export function blockScopedCallback<TRet, TArgs extends readonly unknown[]>
(
    callback: (...args: TArgs) => TRet,
)
    : (...args: TArgs) => TRet
{
    return (...args) => blockScopedLifecycle(() => callback(...args));
}

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
