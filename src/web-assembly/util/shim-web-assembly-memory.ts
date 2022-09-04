import { IWebAssemblyMemoryMemory } from "../../external/i-web-assembly-memory.js";

/**
 * @internal
 */
export function shimWebAssemblyMemory
(
    memory: IWebAssemblyMemoryMemory,
    onGrowCallback: (newBuffer: ArrayBuffer, previousPageCount: number, requestedPagesToAdd: number) => void,
)
    : void
{
    const grow = memory.grow.bind(memory);
    memory.grow = (pagesToAdd: number) =>
    {
        const previousPageCount = grow(pagesToAdd);
        onGrowCallback(memory.buffer, previousPageCount, pagesToAdd);

        return previousPageCount;
    };
}