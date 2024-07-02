/**
 * @public
 */
export interface IMemoryUtilBindings
{
    _jsUtilDeleteObject(pointer: number): void;
    _jsUtilFree(pointer: number): void;
    _jsUtilMalloc(size: number): number;
    _jsUtilCalloc(size: number, elementSize: number): number;
}