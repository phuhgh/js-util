/**
 * @public
 */
export type TDebouncedFn<TArgs extends unknown[]> =
    & ((...args: TArgs) => void)
    & { cancel: () => void }
    ;

/**
 * @public
 * Creates a function that will proxy calls to `functionToProxy` when `wait` time has passed since the last call, using the
 * most recent arguments. Where `immediate` is true, the function immediately proxies the call and will not proxy again until
 * `wait` time passes since the last call.
 *
 * @param functionToProxy - The function to debounce.
 * @param wait - Time to wait in ms.
 * @param immediate - If true run on the leading edge, default false.
 * @returns A debounced function.
 *
 * @remarks
 * As per underscore's debounce, except that returns have been disallowed.
 */
export function fpDebounce<TArgs extends unknown[]>
(
    functionToProxy: (...args: TArgs) => void,
    wait: number,
    immediate: boolean = false,
)
    : TDebouncedFn<TArgs>
{
    let timeout: number | undefined;
    let previous: number;
    let args: TArgs | null;
    let context: unknown;

    function later()
    {
        const passed = Date.now() - previous;

        if (wait > passed)
        {
            timeout = setTimeout(later, wait - passed);
        }
        else
        {
            timeout = undefined;

            if (!immediate)
            {
                functionToProxy.apply(context, args as TArgs);
            }

            // This check is needed because `func` can recursively invoke `debounced`.
            if (timeout == null)
            {
                args = context = null;
            }
        }
    }

    const debounced: TDebouncedFn<TArgs> = function (this: unknown, ..._args: TArgs): number
    {
        context = this;
        args = _args;
        previous = Date.now();

        if (timeout == null)
        {
            timeout = setTimeout(later, wait);

            if (immediate)
            {
                functionToProxy.apply(context, args);
            }
        }

        return timeout;
    };
    debounced.cancel = function ()
    {
        clearTimeout(timeout);
    };

    return debounced;
}

declare const setTimeout: <TArgs extends unknown[]>
(
    functionToProxy: (...args: TArgs) => void,
    period: number,
)
    => number;

declare const clearTimeout: (timeoutId: number | undefined) => void;