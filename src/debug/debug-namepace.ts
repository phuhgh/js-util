import { getGlobal } from "../runtime/get-global";
import { DebugProtectedView } from "./debug-protected-view";
import { DebugWeakValue } from "./debug-weak-value";
import { _Debug } from "./_debug";
import { DebugWeakBroadcastEvent } from "./debug-weak-broadcast-event";
import { DebugSharedObjectLifeCycleChecks } from "./debug-shared-object-life-cycle-checks";
import { IDebugProtectedView, IDebugSharedObjectLifeCycleChecks, IDebugWeakBroadcastEvent, IDebugWeakStore } from "rc-js-util-globals";
import { fpNoOp } from "../fp/impl/fp-no-op";

/**
 * @public
 * Exposed as RcJsUtilDebug in the global namespace when DEBUG_MODE is set to true.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RcJsUtilDebugImpl
{
    /**
     * Emits an event when memory allocations are performed in WASM.
     */
    export let onAllocate: IDebugWeakBroadcastEvent<"debugOnAllocate", []>;
    /**
     * Store for {@link IDebugProtectedView}.
     */
    export let protectedViews: IDebugWeakStore<IDebugProtectedView<object>>;
    /**
     * Wrapper of `_Debug.error`.
     */
    export let error: (message: string) => void;
    /**
     * {@link IDebugSharedObjectLifeCycleChecks}.
     */
    export let sharedObjectLifeCycleChecks: IDebugSharedObjectLifeCycleChecks;

    export let uniquePointers: Set<number>;
}

DEBUG_MODE && _Debug.runBlock(() =>
{
    RcJsUtilDebugImpl.onAllocate = new DebugWeakBroadcastEvent<"debugOnAllocate", []>("debugOnAllocate");
    RcJsUtilDebugImpl.protectedViews = new DebugWeakValue<DebugProtectedView<object>>();
    RcJsUtilDebugImpl.error = (message: string): void => fpNoOp(_Debug.error(message));
    RcJsUtilDebugImpl.sharedObjectLifeCycleChecks = new DebugSharedObjectLifeCycleChecks();
    RcJsUtilDebugImpl.uniquePointers = new Set<number>();

    getGlobal()["RcJsUtilDebug"] = RcJsUtilDebugImpl;
});