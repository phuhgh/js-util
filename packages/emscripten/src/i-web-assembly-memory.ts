/**
 * @public
 * Copied from lib.dom.d.ts to avoid portability issues.
 */
export interface IWebAssemblyMemoryMemory
{
    readonly buffer: ArrayBuffer;
    grow(delta: number): number;
}