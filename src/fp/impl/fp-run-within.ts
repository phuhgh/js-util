import { _Debug } from "../../debug/_debug.js";

/**
 * @public
 * Runs the `callback` within the `wrapperFunctions`. This is useful for "positional" attributes, like debug labels, lifecycle block scopes etc.
 * @remarks
 * See {@link fpRunWithin}.
 */
export function fpRunWithin<TCallback extends (...args: unknown[]) => unknown>
(
    wrapperFunctions: readonly ((callback: () => ReturnType<TCallback>) => ReturnType<TCallback>)[],
    callback: TCallback
)
    : (...args: Parameters<TCallback>) => ReturnType<TCallback>
{
    _BUILD.DEBUG && _Debug.assert(wrapperFunctions.length > 0, "there must be at least one wrapper function");

    return (...args: Parameters<TCallback>): ReturnType<TCallback> =>
    {
        let chained = () => (callback(...args) as ReturnType<TCallback>);

        for (let i = 0, iEnd = wrapperFunctions.length; i < iEnd; ++i)
        {
            const prev = chained;
            chained = () => wrapperFunctions[i](prev);
        }

        return chained();
    };
}