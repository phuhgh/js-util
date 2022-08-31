import { shimWebAssemblyMemory } from "../shim-web-assembly-memory";
import { IEmscriptenDebug, IEmscriptenWrapper } from "./i-emscripten-wrapper";
import { BroadcastEvent } from "../../eventing/broadcast-event";
import { IWebAssemblyMemoryMemory } from "../../external/i-web-assembly-memory";
import { Emscripten } from "../../external/emscripten";
import { _Debug } from "../../debug/_debug";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";
import { DebugWeakBroadcastEvent, IDebugWeakBroadcastEvent } from "../../debug/debug-weak-broadcast-event";
import { IBroadcastEvent } from "../../eventing/i-broadcast-event";
import { IDebugProtectedView } from "../../debug/i-debug-protected-view";
import { IDebugWeakStore } from "../../debug/i-debug-weak-store";
import { DebugSharedObjectLifeCycleChecker, IDebugSharedObjectLifeCycleChecker } from "../../debug/debug-shared-object-life-cycle-checker";
import { DebugWeakValue } from "../../debug/debug-weak-value";

/**
 * @public
 * Exists only with _BUILD.DEBUG true.
 */
export interface IEmscriptenDebugInstance
{
    RC_JS_MEMORY_DEBUG_UTIL: IEmscriptenDebug;
}

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

    if (_BUILD.DEBUG)
    {
        const debugInstance = extension as never as IEmscriptenDebugInstance;
        debugInstance.RC_JS_MEMORY_DEBUG_UTIL = debug;
    }

    const instance = await emscriptenModuleFactory({
        wasmMemory: memory,
        ...extension,
    } as TExt) as TExt & TMod & Emscripten.EmscriptenModule;

    return new EmscriptenWrapper<TExt & TMod>(
        memoryListener,
        instance,
        memory,
        debug,
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
    )
    {
        this.dataView = new DataView(memory.buffer);

        shimWebAssemblyMemory(memory, (buffer, previous, delta) =>
        {
            _BUILD.DEBUG && _Debug.verboseLog(`WebAssembly memory grew from ${previous} to ${previous + delta} pages.`);
            this.dataView = new DataView(this.memory.buffer);
            this.memoryResize.emit(buffer, previous, delta);
        });
    }
}

class EmscriptenDebug implements IEmscriptenDebug
{
    public error(message: string): void
    {
        _Debug.error(message);
    }

    public verboseLog(message: string): void
    {
        _Debug.verboseLog(message);
    }

    public onAllocate: IDebugWeakBroadcastEvent<"debugOnAllocate", []> = new DebugWeakBroadcastEvent("debugOnAllocate");
    public protectedViews: IDebugWeakStore<IDebugProtectedView> = new DebugWeakValue();
    public sharedObjectLifeCycleChecks: IDebugSharedObjectLifeCycleChecker = new DebugSharedObjectLifeCycleChecker();
    public uniquePointers: Set<number> = new Set();
}