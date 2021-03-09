import { AReferenceCounted } from "./a-reference-counted";
import { _Debug } from "../debug/_debug";

/**
 * @public
 * Wrapper of wasm object.
 */
export abstract class ASharedObject extends AReferenceCounted
{
    protected constructor
    (
        protected wasmPtr: number,
    )
    {
        super();
    }

    public getPtr(): number
    {
        DEBUG_MODE && _Debug.assert(!this.getIsDestroyed(), "object has been released already");
        return this.wasmPtr;
    }
}