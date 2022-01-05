/**
 * Importing this file causes mutation of the global object.
 */
import { DebugProtectedView } from "./impl/debug-protected-view";
import { DebugWeakValue } from "./impl/debug-weak-value";
import { _Debug } from "./impl/_debug";
import { DebugWeakBroadcastEvent } from "./impl/debug-weak-broadcast-event";
import { DebugSharedObjectLifeCycleChecks } from "./impl/debug-shared-object-life-cycle-checks";
import { IDebugProtectedView, IDebugSharedObjectLifeCycleChecks, IDebugWeakBroadcastEvent, IDebugWeakStore } from "@rc-js-util/globals";

/**
 * Exposed as RcJsUtilDebug in the global namespace.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace RcJsUtilDebug
{
    /**
     * Emits an event when memory allocations are performed in WASM.
     */
    export let onAllocate: IDebugWeakBroadcastEvent<"debugOnAllocate", []> = new DebugWeakBroadcastEvent<"debugOnAllocate", []>("debugOnAllocate");
    /**
     * Store for {@link IDebugProtectedView}.
     */
    export let protectedViews: IDebugWeakStore<IDebugProtectedView<object>> = new DebugWeakValue<DebugProtectedView<object>>();
    /**
     * Wrapper of `_Debug.error`.
     */
    export let error: (message: string) => void = (message: string): void =>
    {
        _Debug.error(message);
    };
    /**
     * Wrapper of `_Debug.verboseLog`.
     */
    export let verboseLog: (message: string) => void = (message: string) => _Debug.verboseLog(message);
    /**
     * {@link IDebugSharedObjectLifeCycleChecks}.
     */
    export let sharedObjectLifeCycleChecks: IDebugSharedObjectLifeCycleChecks = new DebugSharedObjectLifeCycleChecks();

    export let uniquePointers: Set<number>;
}

_Debug.getGlobalObject()["RcJsUtilDebug"] = RcJsUtilDebug;
