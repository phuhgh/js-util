import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { IInteropBindings } from "../emscripten/i-interop-bindings.js";

/**
 * @public
 */
export interface IResizableArrayBindings extends IInteropBindings
{
    _resizableArray_getDataAddress(numberId: ENumberIdentifier, sharedObj: number): number;
    _resizableArray_setSize(numberId: ENumberIdentifier, newSize: number, sharedObj: number): boolean;
    _resizableArray_createOne(numberId: ENumberIdentifier, size: number): number;
}
