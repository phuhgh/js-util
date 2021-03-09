import { IDictionary } from "../../typescript/i-dictionary";
import { IWebAssemblyMemoryMemory } from "../../../external/i-web-assembly-memory";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";
import { IBroadcastEvent } from "../../eventing/i-broadcast-event";

/**
 * @public
 */
export interface IEmscriptenWrapper
{
    memoryResize: IBroadcastEvent<"onMemoryResize", TWebAssemblyMemoryListenerArgs>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance: IDictionary<any>;
    memory: IWebAssemblyMemoryMemory;
    dataView: DataView;
}