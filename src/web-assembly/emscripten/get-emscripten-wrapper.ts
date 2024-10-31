import { shimWebAssemblyMemory } from "../util/shim-web-assembly-memory.js";
import { type IEmscriptenBinder, IEmscriptenDebugUtils, IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import { BroadcastChannel } from "../../eventing/broadcast-channel.js";
import { Emscripten, IWebAssemblyMemoryMemory } from "../../external/emscripten.js";
import { _Debug } from "../../debug/_debug.js";
import { TWebAssemblyMemoryListenerArgs } from "../util/t-web-assembly-memory-listener-args.js";
import { DebugWeakBroadcastChannel } from "../../debug/debug-weak-broadcast-event.js";
import { IBroadcastChannel } from "../../eventing/i-broadcast-channel.js";
import { IDebugProtectedViewFactory } from "../../debug/i-debug-protected-view-factory.js";
import { DebugSharedObjectLifeCycleChecker } from "../../debug/debug-shared-object-life-cycle-checker.js";
import { DebugWeakStore } from "../../debug/debug-weak-store.js";
import type { IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import type { ILifecycleStrategy } from "./i-lifecycle-strategy.js";

/**
 * @public
 * Factory for creating wrapped emscripten module.
 */
export async function getEmscriptenWrapper<TExt extends object, TMod extends object, TLifeStrategy extends ILifecycleStrategy>
(
    memory: IWebAssemblyMemoryMemory,
    emscriptenModuleFactory: Emscripten.EmscriptenModuleFactory<TMod>,
    lifecycleStrategy: TLifeStrategy,
    extension: Partial<TExt> = {},
)
    : Promise<IEmscriptenWrapper<TExt & TMod, TLifeStrategy>>
{
    const memoryListener = _BUILD.DEBUG
        ? new DebugWeakBroadcastChannel<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize")
        : new BroadcastChannel<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize");
    const debug = new EmscriptenDebug();
    const binder = new EmscriptenBinder();

    if (_BUILD.DEBUG)
    {
        const debugInstance = extension as never as IEmscriptenDebugInstance;
        debugInstance.JSU_DEBUG_UTIL = debug;
    }

    const instance = await emscriptenModuleFactory({
        wasmMemory: memory,
        INITIAL_MEMORY: memory.buffer.byteLength,
        JSU_BINDER: binder,
        ...extension,
    } as TExt) as TExt & TMod & Emscripten.EmscriptenModule;

    const wrapper = new EmscriptenWrapper<TExt & TMod, TLifeStrategy>(
        memoryListener,
        instance,
        memory,
        debug,
        binder,
        lifecycleStrategy
    );
    lifecycleStrategy.setWrapper(wrapper);

    return wrapper;
}

class EmscriptenWrapper<TModule extends object, TLifeStrategy extends ILifecycleStrategy>
    implements IEmscriptenWrapper<TModule, TLifeStrategy>
{
    public constructor
    (
        public readonly memoryResize: IBroadcastChannel<"onMemoryResize", TWebAssemblyMemoryListenerArgs>,
        public readonly instance: TModule & Emscripten.EmscriptenModule,
        public readonly memory: IWebAssemblyMemoryMemory,
        public readonly debugUtils: IEmscriptenDebugUtils,
        public readonly binder: IEmscriptenBinder,
        public readonly lifecycleStrategy: TLifeStrategy,
        public readonly rootNode: IManagedResourceNode = lifecycleStrategy.createRootNode(),
    )
    {

        const state = this.state = new EWState(new DataView(memory.buffer));

        // in debug builds there are retainers on the wasm memory from libraries, sidestep by passing sub-object
        // don't reference `this` here...
        shimWebAssemblyMemory(memory, (buffer, previous, delta) =>
        {
            _BUILD.DEBUG && _Debug.verboseLog(["WASM", "MEMORY"], `WebAssembly memory grew from ${previous} to ${previous + delta} pages.`);
            state.dataView = new DataView(memory.buffer);

            memoryResize.emit(buffer, previous, delta);
        });
    }

    public getDataView(): DataView
    {
        return this.state.dataView;
    }

    private state: EWState;
}

interface IEmscriptenDebugInstance
{
    JSU_DEBUG_UTIL: IEmscriptenDebugUtils;
}

class EmscriptenDebug implements IEmscriptenDebugUtils
{
    public error(message: string): void
    {
        _Debug.error(message);
    }

    public verboseLog(message: string, tags: readonly string[] = defaultTags): void
    {
        _Debug.verboseLog(tags, message);
    }

    public onAllocate: IBroadcastChannel<"debugOnAllocate", []> = new DebugWeakBroadcastChannel("debugOnAllocate");
    public protectedViews = new DebugWeakStore<IDebugProtectedViewFactory>();
    public sharedObjectLifeCycleChecks = new DebugSharedObjectLifeCycleChecker();
    public uniquePointers: Set<number> = new Set();
}

class EmscriptenBinder implements IEmscriptenBinder
{
    public pushBinder(interopObject: unknown): number
    {
        const index = this.counter;
        ++this.counter;
        this.bindingObjects.set(index, interopObject);
        return index;
    }

    public getBinder(index: number): unknown
    {
        return this.bindingObjects.get(index);
    }

    public removeBinder(index: number): boolean
    {
        return this.bindingObjects.delete(index);
    }

    private readonly bindingObjects = new Map<number, unknown>();
    private counter = 0;
}

const defaultTags = ["WASM"];

class EWState
{
    public constructor
    (
        public dataView: DataView,
    )
    {
    }
}