import { shimWebAssemblyMemory } from "../shim-web-assembly-memory";
import { IEmscriptenWrapper } from "./i-emscripten-wrapper";
import { MulticastEvent } from "../../eventing/multicast-event";
import { IWebAssemblyMemoryMemory } from "../../../external/i-web-assembly-memory";
import { Emscripten } from "../../../external/emscripten";
import { _Debug } from "../../debug/_debug";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";

export async function getEmscriptenWrapper
(
    memory: IWebAssemblyMemoryMemory,
    emscriptenModuleFactory: Emscripten.EmscriptenModuleFactory,
)
    : Promise<IEmscriptenWrapper>
{
    const memoryListener = new MulticastEvent<TWebAssemblyMemoryListenerArgs>();
    const instance = await emscriptenModuleFactory({ wasmMemory: memory });
    shimWebAssemblyMemory(memory, (buffer, previous, delta) =>
    {
        DEBUG_MODE && _Debug.runBlock(() =>
        {
            console.debug(`WebAssembly memory grew from ${previous} to ${previous + delta} pages.`);
        });
        wrapper.dataView = new DataView(wrapper.memory.buffer);
        memoryListener.emit(buffer, previous, delta);
    });
    const wrapper = {
        memory: memory,
        memoryResize: memoryListener,
        instance: instance,
        dataView: new DataView(memory.buffer),
    };

    return wrapper;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const console: any;