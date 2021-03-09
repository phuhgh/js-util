import { shimWebAssemblyMemory } from "../shim-web-assembly-memory";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper";
import { BroadcastEvent } from "../../eventing/broadcast-event";
import { IWebAssemblyMemoryMemory } from "../../../external/i-web-assembly-memory";
import { Emscripten } from "../../../external/emscripten";
import { _Debug } from "../../debug/_debug";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";
import { DebugWeakBroadcastEvent } from "../../debug/debug-weak-broadcast-event";

/**
 * @public
 * Factory for creating wrapped emscripten module.
 */
export async function getEmscriptenWrapper<T extends Emscripten.EmscriptenModule>
(
    memory: IWebAssemblyMemoryMemory,
    emscriptenModuleFactory: Emscripten.EmscriptenModuleFactory,
    extension?: Partial<T>,
)
    : Promise<IEmscriptenWrapper>
{
    const memoryListener = DEBUG_MODE
        ? new DebugWeakBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize")
        : new BroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>("onMemoryResize");

    const instance = await emscriptenModuleFactory({
        wasmMemory: memory,
        ...extension,
    });

    shimWebAssemblyMemory(memory, (buffer, previous, delta) =>
    {
        DEBUG_MODE && _Debug.verboseLog(`WebAssembly memory grew from ${previous} to ${previous + delta} pages.`);
        wrapper.dataView = new DataView(wrapper.memory.buffer);
        memoryListener.emit(buffer, previous, delta);
    });

    const wrapper: IEmscriptenWrapper = {
        memory: memory,
        memoryResize: memoryListener,
        instance: instance,
        dataView: new DataView(memory.buffer),
    };

    return wrapper;
}