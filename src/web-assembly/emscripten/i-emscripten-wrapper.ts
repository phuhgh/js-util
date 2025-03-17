import type { TWebAssemblyMemoryListenerArgs } from "../util/t-web-assembly-memory-listener-args.js";
import type { IBroadcastChannel } from "../../eventing/i-broadcast-channel.js";
import type { Emscripten, IWebAssemblyMemoryMemory } from "../../external/emscripten.js";
import type { DebugWeakStore } from "../../debug/debug-weak-store.js";
import type { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import type { DebugSharedObjectLifeCycleChecker } from "../../debug/debug-shared-object-life-cycle-checker.js";
import type { IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import type { ILifecycleStrategy } from "./i-lifecycle-strategy.js";
import type { IStableStore } from "../../runtime/rtti-interop.js";

/**
 * @public
 */
export interface IEmscriptenBinder
{
    pushBinder(interopObject: unknown): number;
    getBinder(index: number): unknown;
    removeBinder(index: number): boolean;
}

/**
 * @public
 */
export interface IEmscriptenDebugUtils
{
    /**
     * Emits an event on memory allocation.
     */
    onAllocate: IBroadcastChannel<"debugOnAllocate", []>;
    /**
     * Store for {@link IDebugProtectedViewFactory}.
     */
    protectedViews: DebugWeakStore<IDebugProtectedViewFactory, IManagedResourceNode>;
    /**
     * Wrapper of `_Debug.error`.
     */
    error: (message: string) => void;
    /**
     * Wrapper of `_Debug.verboseLog`.
     */
    verboseLog: (tags: string[], message: string) => void;
    /**
     * {@link DebugSharedObjectLifeCycleChecker}.
     */
    sharedObjectLifeCycleChecks: DebugSharedObjectLifeCycleChecker;

    /**
     * It is an error for two unique pointers to point to the same thing.
     */
    uniquePointers: Set<number>;
}

/**
 * @public
 */
export interface IEmscriptenWrapper<TModule extends object, TLifeStrategy extends ILifecycleStrategy = ILifecycleStrategy>
{
    readonly memoryResize: IBroadcastChannel<"onMemoryResize", TWebAssemblyMemoryListenerArgs>;
    readonly instance: TModule & Emscripten.EmscriptenModule;
    readonly memory: IWebAssemblyMemoryMemory;
    readonly debugUtils: IEmscriptenDebugUtils;
    readonly binder: IEmscriptenBinder;
    readonly lifecycleStrategy: TLifeStrategy;
    readonly interopIds: IStableStore;
    /**
     * This Emscripten instance's root node for memory management of shared objects.
     */
    readonly rootNode: IManagedResourceNode;

    /**
     * Replaced after each memory resize, don't hold onto it.
     */
    getDataView(): DataView;

    /**
     * Unlink all managed handles from the root node. Convenience method.
     */
    destroyLinked(): void;
}