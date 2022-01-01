/**
 * @public
 */
export interface IMemoryUtilBindings
{
    _jsUtilFree(pointer: number): void;
    _jsUtilMalloc(size: number): number;
    _jsUtilCalloc(size: number, elementSize: number): number;
}