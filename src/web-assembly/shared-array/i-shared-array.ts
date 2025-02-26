import type { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import type { IManagedObject, ISharedObjectSmartPtr } from "../../lifecycle/manged-resources.js";
import type { IBuffer } from "../../array/typed-array/i-buffer-view.js";

/**
 * @public
 * Typed array representing a contiguous block of memory in wasm.
 *
 * @remarks
 * NB the pointer does not necessarily point to the start of the block (e.g. it may be related to life cycle instead),
 * this is implementation defined.
 */
export interface ISharedArray<TCtor extends TTypedArrayCtor>
    extends IManagedObject,
            ISharedObjectSmartPtr,
            IBuffer<TCtor>
{
    readonly length: number;
}
