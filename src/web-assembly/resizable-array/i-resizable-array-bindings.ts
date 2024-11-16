import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";

/**
 * @public
 */
export interface IResizableArrayBindings
{
    _resizableArray_getDataAddress(numberId: ENumberIdentifier, sharedObj: number): number;
    _resizableArray_setSize(numberId: ENumberIdentifier, newSize: number, sharedObj: number): boolean;
    _resizableArray_createOne(numberId: ENumberIdentifier, size: number): number;
}