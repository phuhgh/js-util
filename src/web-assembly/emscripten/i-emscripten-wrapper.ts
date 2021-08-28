import { IWebAssemblyMemoryMemory } from "../../../external/i-web-assembly-memory";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";
import { IBroadcastEvent } from "../../eventing/i-broadcast-event";
import { Emscripten } from "../../../external/emscripten";

/**
 * @public
 */
export interface IEmscriptenWrapper<T extends object>
{
    memoryResize: IBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance: T & Emscripten.EmscriptenModule;
    memory: IWebAssemblyMemoryMemory;
    dataView: DataView;
}