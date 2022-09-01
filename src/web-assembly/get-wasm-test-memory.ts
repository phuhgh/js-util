import { IWebAssemblyMemoryMemory } from "../external/i-web-assembly-memory.js";

/**
 * @internal
 */
export function getWasmTestMemory(options: { initial: number, maximum?: number }): IWebAssemblyMemoryMemory
{
    return new WebAssembly.Memory(options);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace WebAssembly
{
    interface Memory
    {
        readonly buffer: ArrayBuffer;
        grow(delta: number): number;
    }

    let Memory: {
        prototype: Memory;
        new(descriptor: MemoryDescriptor): Memory;
    };

    interface MemoryDescriptor
    {
        initial: number;
        maximum?: number;
    }
}
