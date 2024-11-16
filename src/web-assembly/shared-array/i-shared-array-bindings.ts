import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";

/**
 * @public
 */
export interface ISharedArrayBindings
{
    _sharedArray_createOne(numberId: ENumberIdentifier, size: number, clearMemory: boolean): number;
    _sharedArray_getDataAddress(numberId: ENumberIdentifier, objPointer: number): number;
}

