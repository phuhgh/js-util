import { IReferenceCountedPtr } from "../web-assembly/util/reference-counted-ptr.js";

/**
 * @public
 * Holds a reference to wasm object.
 */
export interface ISharedObject
{
    readonly sharedObject: IReferenceCountedPtr;
}