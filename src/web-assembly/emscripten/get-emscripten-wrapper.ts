import { shimWebAssemblyMemory } from "../util/shim-web-assembly-memory.js";
import { EBinderKind, type IEmscriptenBinder, IEmscriptenDebug, IEmscriptenWrapper } from "./i-emscripten-wrapper.js";
import { BroadcastEvent } from "../../eventing/broadcast-event.js";
import { Emscripten, IWebAssemblyMemoryMemory } from "../../external/emscripten.js";
import { _Debug } from "../../debug/_debug.js";
import { TWebAssemblyMemoryListenerArgs } from "../util/t-web-assembly-memory-listener-args.js";
import { DebugWeakBroadcastEvent, IDebugWeakBroadcastEvent } from "../../debug/debug-weak-broadcast-event.js";
import { IBroadcastEvent } from "../../eventing/i-broadcast-event.js";
import { IDebugProtectedView } from "../../debug/i-debug-protected-view.js";
import { IDebugWeakStore } from "../../debug/i-debug-weak-store.js";
import { DebugSharedObjectLifeCycleChecker, IDebugSharedObjectLifeCycleChecker } from "../../debug/debug-shared-object-life-cycle-checker.js";
import { DebugWeakValue } from "../../debug/debug-weak-value.js";
import { _Production } from "../../production/_production.js";

/**
 * @public
 * Factory for creating wrapped emscripten module.
 */
export async function getEmscriptenWrapper<TExt extends object, TMod extends object>
(
    memory: IWebAssemblyMemoryMemory,
    emscriptenModuleFactory: Emscripten.EmscriptenModuleFactory<TMod>,
    extension: Partial<TExt> = {},
)
    : Promise<IEmscriptenWrapper<TExt & TMod>>
{
    const memoryListener = _BUILD.DEBUG
        ? new DebugWeakBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize")
        : new BroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize");
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

    return new EmscriptenWrapper<TExt & TMod>(
        memoryListener,
        instance,
        memory,
        debug,
        binder,
    );
}

class EmscriptenWrapper<T extends object> implements IEmscriptenWrapper<T>
{
    public dataView: DataView;

    public constructor
    (
        public readonly memoryResize: IBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>,
        public readonly instance: T & Emscripten.EmscriptenModule,
        public readonly memory: IWebAssemblyMemoryMemory,
        public readonly debug: IEmscriptenDebug,
        public readonly binder: IEmscriptenBinder,
    )
    {
        this.dataView = new DataView(memory.buffer);

        shimWebAssemblyMemory(memory, (buffer, previous, delta) =>
        {
            _BUILD.DEBUG && _Debug.verboseLog(["WASM", "MEMORY"], `WebAssembly memory grew from ${previous} to ${previous + delta} pages.`);
            this.dataView = new DataView(this.memory.buffer);
            this.memoryResize.emit(buffer, previous, delta);
        });
    }
}

interface IEmscriptenDebugInstance
{
    JSU_DEBUG_UTIL: IEmscriptenDebug;
}

class EmscriptenDebug implements IEmscriptenDebug
{
    public error(message: string): void
    {
        _Debug.error(message);
    }

    public verboseLog(message: string, tags: readonly string[] = defaultTags): void
    {
        _Debug.verboseLog(tags, message);
    }

    public onAllocate: IDebugWeakBroadcastEvent<"debugOnAllocate", []> = new DebugWeakBroadcastEvent("debugOnAllocate");
    public protectedViews: IDebugWeakStore<IDebugProtectedView> = new DebugWeakValue();
    public sharedObjectLifeCycleChecks: IDebugSharedObjectLifeCycleChecker = new DebugSharedObjectLifeCycleChecker();
    public uniquePointers: Set<number> = new Set();
}

class EmscriptenBinder implements IEmscriptenBinder
{
    public push(interopObject: unknown): void
    {
        this.bindingObjects.set(this.counter++, interopObject);
    }

    public getLast(kind: EBinderKind): number
    {
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            switch (kind)
            {
                case EBinderKind.Callback:
                    _Debug.assert(
                        typeof this.bindingObjects.get(this.counter - 1) == "function",
                        "expected to find callback",
                    );
                    break;
                default:
                    _Production.assertValueIsNever(kind);
            }
        });
        return this.counter - 1;
    }

    public remove(index: number): boolean
    {
        return this.bindingObjects.delete(index);
    }

    public callback(index: number): void
    {
        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            const binder = this.bindingObjects.get(index);
            const binderType = typeof binder;
            _Debug.assert(
                binderType == "function",
                `expected to find function at ${index}, got ${binderType}`,
            );
        });

        (this.bindingObjects.get(index) as () => void)();
    }

    private readonly bindingObjects = new Map<number, unknown>();
    private counter = 0;
}

const defaultTags = ["WASM"];