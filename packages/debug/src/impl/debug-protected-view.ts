import { _Debug } from "./_debug";
import { IDebugProtectedView } from "@rc-js-util/globals";

/**
 * @public
 * Provides a view of an object that can be invalidated, causing attempts to access it to error in `DEBUG_MODE`.
 *
 * @remarks
 * Allows the specification of `safeKeys`, accessing of these is not an error regardless of invalidation state.
 */
export class DebugProtectedView<T extends object> implements IDebugProtectedView<T>
{
    public static createTypedArrayView = <TArray extends ArrayBufferView>(): DebugProtectedView<TArray> =>
    {
        return new DebugProtectedView<Float32Array>(["BYTES_PER_ELEMENT"], "Shared Array - memory resize danger, refresh instance with getInstance");
    }

    public constructor
    (
        safeKeys: (keyof T)[],
        private readonly debugInfo: string,
    )
    {
        this.safeKeys = new Set(safeKeys) as Set<string | symbol>;
    }

    public invalidate(): void
    {
        this.validViews.clear();
    }

    public createProtectedView<T extends object>(view: T): T
    {
        this.validViews.add(view);

        return new Proxy(view, {
            get: (_target: T, property: string | symbol) =>
            {
                if (property === DebugProtectedView.originalViewKey)
                {
                    return view;
                }

                if (property === DebugProtectedView.isViewValidKey)
                {
                    return this.validViews.has(view);
                }

                if (property === DebugProtectedView.debugMessageKey)
                {
                    return `ProtectedView view invalidated - ${this.debugInfo}`;
                }

                if (!this.validViews.has(view))
                {
                    _Debug.assert(this.safeKeys.has(property), `ProtectedView view invalidated - ${this.debugInfo}`);
                }

                if (typeof view[property as keyof T] == "function")
                {
                    return (view[property as keyof T] as unknown as Function).bind(view);
                }

                return view[property as keyof T];
            }
        });
    }

    public static unwrapProtectedView<T extends object>(view: T): T
    {
        const hiddenView = (view as IDictionary<T | undefined>)[DebugProtectedView.originalViewKey];

        if (hiddenView == null)
        {
            // it's not a proxy
            return view;
        }

        if (!(view as IDictionary<boolean>)[DebugProtectedView.isViewValidKey])
        {
            _Debug.error((view as IDictionary<string>)[DebugProtectedView.debugMessageKey]);
        }

        return hiddenView as T;
    }

    private validViews = new Set<object>();
    private readonly safeKeys: Set<string | symbol>;
    private static isViewValidKey = Symbol("isViewValid");
    private static originalViewKey = Symbol("originalView");
    private static debugMessageKey = Symbol("debugMessage");
}

interface IDictionary<T>
{
    [index: string | symbol]: T;
}