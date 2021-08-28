import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted";
import { _Debug } from "../debug/_debug";
import { nullPointer } from "../web-assembly/emscripten/null-pointer";

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
 * Wrapper of wasm object.
 * NB The object is pre-claimed (ref count 1) on creation.
 */
export interface IReferenceCountedPtr extends IReferenceCounted
{
    isStatic: boolean;
    getPtr(): number;
}

/**
 * @public
 */
export interface IOnRelease
{
    onRelease(): void
}

/**
 * @public
 * Wrapper of wasm object.
 */
export class ReferenceCountedPtr extends AReferenceCounted implements IReferenceCountedPtr, IOnRelease
{
    public getPtr(): number
    {
        return this.wasmPtr;
    }

    public onRelease(): void
    {
        this.listener.onRelease();
    }

    public constructor
    (
        public isStatic: boolean,
        protected wasmPtr: number,
        public listener: { onRelease(): void },
    )
    {
        super();
        DEBUG_MODE && _Debug.assert(this.wasmPtr !== nullPointer && this.wasmPtr != null, "expected pointer to object but got null pointer");
    }
}