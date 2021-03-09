import { _Debug } from "../debug/_debug";

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
 */
export abstract class AReferenceCounted implements IReferenceCounted
{
    /**
     * Call when the object is received.
     */
    public claim(): void
    {
        if (this.references === 0)
        {
            DEBUG_MODE && _Debug.error("object has been released already");
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
            this.onRelease();
        }
    }

    protected abstract onRelease(): void;

    public getIsDestroyed(): boolean
    {
        return this.references === 0;
    }

    private references = 1;
}