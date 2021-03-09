import { IWebAssemblyMemoryMemory } from "../../external/i-web-assembly-memory";

/**
 * @internal
 */
export function geWasmTestMemory(): IWebAssemblyMemoryMemory
{
    return new WebAssembly.Memory({ initial: 256, maximum: 512 });
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
