import { AReferenceCounted, IReferenceCounted } from "./a-reference-counted";
import { _Debug } from "../debug/_debug";
import { nullPointer } from "../web-assembly/emscripten/null-pointer";

/**
 * @public
 * Wrapper of wasm object.
 */
export interface ISharedObject extends IReferenceCounted
{
    isStatic: boolean;
    getPtr(): number;
}

/**
 * @public
 * Wrapper of wasm object.
 */
export abstract class ASharedObject extends AReferenceCounted implements ISharedObject
{
    public getPtr(): number
    {
        return this.wasmPtr;
    }

    protected constructor
    (
        public isStatic: boolean,
        protected wasmPtr: number,
    )
    {
        super();
        DEBUG_MODE && _Debug.assert(this.wasmPtr !== nullPointer, "expected pointer to object but got null pointer");
    }
}