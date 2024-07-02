import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { IReferenceCounted } from "./a-reference-counted.js";
import { _Debug } from "../debug/_debug.js";

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
    return (...args) =>
    {
        const ret = blockScopedLifecycle(() => callback(...args));
        return ret;
    };
}

/**
 * @public
 * Exactly like {@link blockScopedCallback}, but for promises.
 */
export function asyncBlockScopedCallback<TRet, TArgs extends readonly unknown[]>
(
    callback: (...args: TArgs) => Promise<TRet>,
)
    : (...args: TArgs) => Promise<TRet>
{
    return (...args) =>
    {
        return asyncBlockScopedLifecycle(() => callback(...args));
    };
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
            _BUILD.DEBUG && _Debug.assert(!(ret instanceof Promise), "found promise, use asyncBlockScopedLifecycle instead");
            releaseRefs(refs);
        }
        finally
        {
            lifecycleStack.pop();
        }
    }

    return ret;
}

/**
 * @public
 * Exactly like {@link blockScopedLifecycle}, but for promises.
 */
export async function asyncBlockScopedLifecycle<TRet>
(
    callback: () => Promise<TRet>,
)
    : Promise<TRet>
{
    const refs = lifecycleStack.push();
    let ret: TRet | undefined;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (_BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH)
    {
        ret = await callback();
        releaseRefs(refs);
        lifecycleStack.pop();
    }
    else
    {
        try
        {
            ret = await callback();
            releaseRefs(refs);
        }
        finally
        {
            lifecycleStack.pop();
        }
    }

    return ret;
}

/**
 * @internal
 */
export function releaseRefs
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
