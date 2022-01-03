import { shimWebAssemblyMemory } from "../shim-web-assembly-memory";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper";
import { _Debug, DebugWeakBroadcastEvent } from "@rc-js-util/debug";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";
import { BroadcastEvent } from "@rc-js-util/core";
import { IWebAssemblyMemoryMemory } from "./i-web-assembly-memory";
import { Emscripten } from "./emscripten";

/**
 * @public
 * Factory for creating wrapped emscripten module.
 */
export async function getEmscriptenWrapper<TExt extends object, TMod extends object>
(
    memory: IWebAssemblyMemoryMemory,
    emscriptenModuleFactory: Emscripten.EmscriptenModuleFactory<TMod>,
    extension?: Partial<TExt>,
)
    : Promise<IEmscriptenWrapper<TExt & TMod>>
{
    const memoryListener = DEBUG_MODE
        ? new DebugWeakBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize")
        : new BroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize");

    const instance = await emscriptenModuleFactory({
        wasmMemory: memory,
        ...extension,
    } as TExt) as TExt & TMod & Emscripten.EmscriptenModule;

    shimWebAssemblyMemory(memory, (buffer, previous, delta) =>
    {
        DEBUG_MODE && _Debug.verboseLog(`WebAssembly memory grew from ${previous} to ${previous + delta} pages.`);
        wrapper.dataView = new DataView(wrapper.memory.buffer);
        memoryListener.emit(buffer, previous, delta);
    });

    const wrapper: IEmscriptenWrapper<TExt & TMod> = {
        memory: memory,
        memoryResize: memoryListener,
        instance: instance,
        dataView: new DataView(memory.buffer),
    };

    return wrapper;
}
