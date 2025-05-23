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
import type { IJsUtilBindings } from "../i-js-util-bindings.js";
import { type IStableStore, StableIdStore } from "../../runtime/rtti-interop.js";

/**
 * @public
 * Factory for creating wrapped emscripten module.
 */
export async function getEmscriptenWrapper<TExt extends object, TMod extends IJsUtilBindings, TLifeStrategy extends ILifecycleStrategy>
(
    memory: IWebAssemblyMemoryMemory,
    emscriptenModuleFactory: Emscripten.EmscriptenModuleFactory<TMod>,
    lifecycleStrategy: TLifeStrategy,
    options: EmscriptenWrapperOptions<TExt>,
    extension: Partial<TExt> = {},
)
    : Promise<IEmscriptenWrapper<TExt & TMod, TLifeStrategy>>
{
    let debugLabel: string | undefined = undefined;
    try
    {
        if (_BUILD.DEBUG)
        {
            debugLabel = _Debug.label;
            _Debug.label = "EmscriptenWrapper";
        }

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
            lifecycleStrategy,
            options
        );
        lifecycleStrategy.setWrapper(wrapper);
        // this depends on the lifecycle strategy having being initialized...
        wrapper.interopIds.initialize();
        initializeSubmodules(instance);
        return wrapper;
    }
    finally
    {
        if (_BUILD.DEBUG)
        {
            _Debug.label = debugLabel;
        }
    }

}

/**
 * @public
 */
export class EmscriptenWrapperOptions<TModule extends object>
{
    public constructor
    (
        readonly initializeCallbacks: readonly ((wrapper: IEmscriptenWrapper<TModule, ILifecycleStrategy>) => void)[],
    )
    {
    }

    public extend<TExtModule extends object>(options: EmscriptenWrapperOptions<TExtModule>): EmscriptenWrapperOptions<TModule & TExtModule>
    {
        return new EmscriptenWrapperOptions<TModule & TExtModule>(
            (this as EmscriptenWrapperOptions<TModule & TExtModule>).initializeCallbacks.concat(options.initializeCallbacks)
        );
    }
}

class EmscriptenWrapper<TModule extends object, TLifeStrategy extends ILifecycleStrategy>
    implements IEmscriptenWrapper<TModule, TLifeStrategy>
{
    public readonly interopIds: IStableStore = new StableIdStore(this as IEmscriptenWrapper<object> as IEmscriptenWrapper<IJsUtilBindings>);

    public constructor
    (
        public readonly memoryResize: IBroadcastChannel<"onMemoryResize", TWebAssemblyMemoryListenerArgs>,
        public readonly instance: TModule & IJsUtilBindings & Emscripten.EmscriptenModule,
        public readonly memory: IWebAssemblyMemoryMemory,
        public readonly debugUtils: IEmscriptenDebugUtils,
        public readonly binder: IEmscriptenBinder,
        public readonly lifecycleStrategy: TLifeStrategy,
        options: EmscriptenWrapperOptions<TModule>,
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

        const callbacks = options.initializeCallbacks;
        for (let i = 0, iEnd = callbacks.length; i < iEnd; i++)
        {
            callbacks[i](this);
        }
    }

    public destroyLinked()
    {
        this.rootNode.getLinked().unlinkAll();
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

    public verboseLog(tags: readonly string[], message: string): void
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

class EWState
{
    public constructor
    (
        public dataView: DataView,
    )
    {
    }
}

function initializeSubmodules(instance: Emscripten.EmscriptenModule): void
{
    const keys = Object.keys(instance);

    for (let i = 0, iEnd = keys.length; i < iEnd; i++)
    {
        const key = keys[i];
        if (key.startsWith("_jsuInitialize"))
        {
            const fn = (instance[key as keyof typeof instance] as () => void);
            _BUILD.DEBUG && _Debug.assert(fn.length === 0, "initialization function must be parameterless");
            fn();
        }
    }
}