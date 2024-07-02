import { IReferenceCountedPtr } from "../web-assembly/util/reference-counted-ptr.js";
import { IReferenceCounted } from "./a-reference-counted.js";

/**
 * @public
 * Holds a reference to wasm object.
 */
export interface ISharedObject
{
    readonly sharedObject: IReferenceCountedPtr;
}

/**
 * @public
 * Holds a reference to wasm objects, is not itself a shared object.
 */
export interface ISharedObjectOwner
{
    readonly sharedObject: IReferenceCounted;
}