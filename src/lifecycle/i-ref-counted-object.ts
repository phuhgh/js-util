import { IReferenceCounted } from "./a-reference-counted";

/**
 * @public
 * Holds references to resource(s) that must be life-cycle managed.
 */
export interface IRefCountedObject
{
    readonly sharedObject: IReferenceCounted;
}