import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { IInteropBindings } from "../emscripten/i-interop-bindings.js";

/**
 * @public
 */
export interface ISharedArrayBindings extends IInteropBindings
{
    _sharedArray_createOne(numberId: ENumberIdentifier, size: number, clearMemory: boolean): number;
    _sharedArray_getDataAddress(numberId: ENumberIdentifier, objPointer: number): number;
}

