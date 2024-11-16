import type { IManagedObject } from "../../lifecycle/manged-resources.js";
import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { TTypedArrayCtor } from "./t-typed-array-ctor.js";

/**
 * @public
 * Wraps a buffer of some sort, providing a typed array view and some other metadata useful for interop.
 */
export interface IBuffer<TCtor extends TTypedArrayCtor>
{
    readonly ctor: TCtor;
    readonly numberId: ENumberIdentifier;
    // size of the shared array
    readonly byteSize: number;

    getSharedObjectHandle(): IManagedObject | null;
    getDataView(): DataView;
    getArray(): InstanceType<TCtor>;
}