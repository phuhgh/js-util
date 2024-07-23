import { TWebAssemblyMemoryListenerArgs } from "../util/t-web-assembly-memory-listener-args.js";
import { IBroadcastChannel } from "../../eventing/i-broadcast-channel.js";
import { Emscripten, IWebAssemblyMemoryMemory } from "../../external/emscripten.js";
import { IDebugWeakStore } from "../../debug/i-debug-weak-store.js";
import { IDebugProtectedView } from "../../debug/i-debug-protected-view.js";
import { IDebugSharedObjectLifeCycleChecker } from "../../debug/debug-shared-object-life-cycle-checker.js";


/**
 * @public
 */
export enum EBinderKind
{
    Callback = 1,
}

/**
 * @public
 */
export interface IEmscriptenBinder
{
    push(interopObject: unknown): void;
    getLast(kind: EBinderKind): number;
    callback(index: number): void;
    remove(index: number): boolean;
}

/**
 * @public
 */
export interface IEmscriptenDebug
{
    /**
     * Emits an event on memory allocation.
     */
    onAllocate: IBroadcastChannel<"debugOnAllocate", []>;
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
    memoryResize: IBroadcastChannel<"onMemoryResize", TWebAssemblyMemoryListenerArgs>;
    instance: T & Emscripten.EmscriptenModule;
    memory: IWebAssemblyMemoryMemory;
    dataView: DataView;
    debug: IEmscriptenDebug;
    binder: IEmscriptenBinder;
}