import { TKeysOf } from "../typescript/t-keys-of";
import { _Debug } from "./_debug";
import { arrayContains } from "../array/impl/array-contains";
import { IDebugProtectedView } from "rc-js-util-globals";
import { TTypedArrayCtor } from "../array/typed-array/t-typed-array-ctor";

/**
 * @public
 */
export class DebugProtectedView<T extends object> implements IDebugProtectedView<T>
{
    public static createTypedArrayView = <TCtor extends TTypedArrayCtor>(): DebugProtectedView<InstanceType<TCtor>> =>
    {
        return new DebugProtectedView<InstanceType<TCtor>>(["BYTES_PER_ELEMENT"], "Shared Array - memory resize danger, refresh instance with getInstance");
    }

    public constructor
    (
        private readonly safeKeys: TKeysOf<T>,
        private readonly debugInfo: string,
    )
    {
    }

    public invalidate(): void
    {
        this.validViews.clear();
    }

    public createProtectedView<T extends object>(view: T): T
    {
        this.validViews.add(view);

        const proxy = new Proxy(view, {
            get: (_target: T, property: string | symbol) =>
            {
                if (!Boolean(this.validViews.has(view)))
                {
                    _Debug.assert(arrayContains(this.safeKeys as string[], property), `ProtectedView view invalidated - ${this.debugInfo}`);
                }

                if (typeof view[property as keyof T] == "function")
                {
                    return (view[property as keyof T] as unknown as Function).bind(view);
                }

                return view[property as keyof T];
            }
        });

        DebugProtectedView.views.set(proxy, view);

        return proxy;
    }

    public static unwrapProtectedView<T extends object>(view: T): T
    {
        const hiddenView = DebugProtectedView.views.get(view);

        if (hiddenView == null)
        {
            return view;
        }

        return hiddenView as T;
    }

    private validViews = new Set<object>();
    private static views = new WeakMap<object, object>();
}