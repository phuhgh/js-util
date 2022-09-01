import { IWebAssemblyMemoryMemory } from "../../external/i-web-assembly-memory.js";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args.js";
import { IBroadcastEvent } from "../../eventing/i-broadcast-event.js";
import { Emscripten } from "../../external/emscripten.js";
import { IDebugWeakBroadcastEvent } from "../../debug/debug-weak-broadcast-event.js";
import { IDebugWeakStore } from "../../debug/i-debug-weak-store.js";
import { IDebugProtectedView } from "../../debug/i-debug-protected-view.js";
import { IDebugSharedObjectLifeCycleChecker } from "../../debug/debug-shared-object-life-cycle-checker.js";

/**
 * @public
 */
export interface IEmscriptenDebug
{
    /**
     * Emits an event on memory allocation.
     */
    onAllocate: IDebugWeakBroadcastEvent<"debugOnAllocate", []>;
    /**
     * Store for {@link IDebugProtectedView}.
     */
    protectedViews: IDebugWeakStore<IDebugProtectedView>;
    /**
     * Wrapper of `_Debug.error`.
     */
    error: (message: string) => void;
    /**
     * Wrapper of `_Debug.verboseLog`.
     */
    verboseLog: (message: string) => void;
    /**
     * {@link IDebugSharedObjectLifeCycleChecker}.
     */
    sharedObjectLifeCycleChecks: IDebugSharedObjectLifeCycleChecker;

    /**
     * It is an error for two unique pointers to point to the same thing.
     */
    uniquePointers: Set<number>;
}

/**
 * @public
 */
export interface IEmscriptenWrapper<T extends object>
{
    memoryResize: IBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>;
    instance: T & Emscripten.EmscriptenModule;
    memory: IWebAssemblyMemoryMemory;
    dataView: DataView;
    debug: IEmscriptenDebug
}