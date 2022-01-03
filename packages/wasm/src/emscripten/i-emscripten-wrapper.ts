import { IBroadcastEvent } from "@rc-js-util/core";
import { IWebAssemblyMemoryMemory } from "./i-web-assembly-memory";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";
import { Emscripten } from "./emscripten";

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
