import { IDictionary } from "../../typescript/i-dictionary";
import { MulticastEvent } from "../../eventing/multicast-event";
import { IWebAssemblyMemoryMemory } from "../../../external/i-web-assembly-memory";
import { TWebAssemblyMemoryListenerArgs } from "../t-web-assembly-memory-listener-args";

/**
 * @public
 */
export interface IEmscriptenWrapper
{
    memoryResize: MulticastEvent<TWebAssemblyMemoryListenerArgs>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance: IDictionary<any>;
    memory: IWebAssemblyMemoryMemory;
    dataView: DataView;
}