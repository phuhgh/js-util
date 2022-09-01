import { _Debug } from "../debug/_debug.js";
import { IOnFree } from "./i-on-free.js";

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 */
export interface IReferenceCounted
{
    claim(): void;
    release(): void;
    getIsDestroyed(): boolean;
}

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 * NB The object is pre-claimed (ref count 1) on creation.
 */
export abstract class AReferenceCounted implements IReferenceCounted, IOnFree
{
    /**
     * Call when the object is received.
     */
    public claim(): void
    {
        if (this.references === 0)
        {
            _BUILD.DEBUG && _Debug.error("object has been released already");
            return;
        }

        ++this.references;
    }

    /**
     * Call when done with the object.
     */
    public release(): void
    {
        if (--this.references === 0)
        {
            this.onFree();
        }
    }

    public abstract onFree(): void;

    public getIsDestroyed(): boolean
    {
        return this.references <= 0;
    }

    private references = 1;
}