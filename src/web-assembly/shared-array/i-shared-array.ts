import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor";
import { ISharedObject } from "../../lifecycle/i-shared-object";

/**
 * @public
 * Typed array representing a contiguous block of memory in wasm.
 *
 * @remarks
 * NB the pointer does not necessarily point to the start of the block (e.g. it may be related to life cycle instead),
 * this is implementation defined.
 */
export interface ISharedArray<TCtor extends TTypedArrayCtor> extends ISharedObject
{
    readonly ctor: TCtor;
    readonly length: number;
    /**
     * Size of element in the array, length * elementByteSize is not necessarily the size of the object.
     */
    readonly elementByteSize: number;
    getInstance(): InstanceType<TCtor>;
}