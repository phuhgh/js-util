import { TProperty } from "../../typescript/t-property.js";
import type { ENumberIdentifier } from "../../array/typed-array/rtti-interop.js";

/**
 * @public
 */
export interface ISharedArrayBindings
    extends TProperty<`_sharedArray_createOne`, (numberId: ENumberIdentifier, size: number, clearMemory: boolean) => number>,
            TProperty<`_sharedArray_getArrayAddress`, (numberId: ENumberIdentifier, objPointer: number) => number>
{
}