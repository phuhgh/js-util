import { TKeysOf } from "../typescript/t-keys-of.js";
import { _Debug } from "./_debug.js";
import { arrayContains } from "../array/impl/array-contains.js";
import { TTypedArrayCtor } from "../array/typed-array/t-typed-array-ctor.js";
import { IDictionary } from "../typescript/i-dictionary.js";
import { IDebugProtectedViewFactory } from "./i-debug-protected-view-factory.js";
import { stringConcat2 } from "../string/impl/string-concat-2.js";

/**
 * @public
 * Provides a view of an object that can be invalidated, causing attempts to access it to error in `_BUILD.DEBUG`.
 *
 * @remarks
 * Allows the specification of `safeKeys`, accessing of these is not an error regardless of invalidation state.
 */
export class DebugProtectedView<TView extends object> implements IDebugProtectedViewFactory
{
    public static createTypedArrayView = <TCtor extends TTypedArrayCtor>
    (
        instanceName: string
    )
        : DebugProtectedView<InstanceType<TCtor>> =>
    {
        return new DebugProtectedView<InstanceType<TCtor>>(
            stringConcat2(instanceName, " - memory resize danger, refresh instance with getInstance"),
            ["BYTES_PER_ELEMENT"],
        );
    };

    public constructor
    (
        private readonly debugInfo: string,
        private readonly safeKeys: TKeysOf<TView> = [],
    )
    {
    }

    public debugOnAllocate(): void
    {
        this.invalidate();
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
                    _Debug.assert(arrayContains(this.safeKeys as string[], property), `ProtectedView view invalidated - ${this.debugInfo}`);
                }

                if (typeof view[property as keyof T] == "function")
                {
                    return (view[property as keyof T] as unknown as Function).bind(view) as unknown;
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

        return hiddenView;
    }

    private validViews = new Set<object>();
    private static isViewValidKey = Symbol("isViewValid");
    private static originalViewKey = Symbol("originalView");
    private static debugMessageKey = Symbol("debugMessage");
}
