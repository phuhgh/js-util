import { _Debug } from "../debug/_debug.js";
import { ILinkedReferences, LinkedReferences } from "./linked-references.js";
import { ITemporaryListener, TemporaryListener } from "./temporary-listener.js";

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 */
export interface IReferenceCounted
{
    claim(): void;
    release(): void;
    getIsDestroyed(): boolean;
    getLinkedReferences(): ILinkedReferences;
    /**
     * Callback will be called when the reference count hits 0. Useful for cleanup.
     */
    registerOnFreeListener(callback: () => void): void;
    /**
     * Remove the listener set by "registerOnFreeListener".
     */
    unregisterOnFreeListener(callback: () => void): void;
}

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 * NB The object is pre-claimed (ref count 1) on creation.
 */
export abstract class AReferenceCounted implements IReferenceCounted
{
    /**
     * Take a claim on the object, preventing it from being destroyed. Once you're done with the object you should
     * call `release`.
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
     * Release claim on the object, objects start with a reference count of 1 (the creator); if you didn't create the
     * object, you shouldn't release it if you didn't call `claim` first.
     */
    public release(): void
    {
        if (--this.references === 0)
        {
            this.onFree();
        }
    }

    public getIsDestroyed(): boolean
    {
        return this.references <= 0;
    }

    public getLinkedReferences(): ILinkedReferences
    {
        if (this.linkedReferences == null)
        {
            return this.linkedReferences = new LinkedReferences(this);
        }

        return this.linkedReferences;
    }


    public registerOnFreeListener(callback: () => void): void
    {
        this.onFreeListener = this.onFreeListener ?? new TemporaryListener();
        this.onFreeListener.addListener(callback);
    }

    public unregisterOnFreeListener(callback: () => void): void
    {
        if (this.onFreeListener)
        {
            this.onFreeListener.removeListener(callback);
        }
    }

    /**
     * DO NOT CALL THIS DIRECTLY, CALL RELEASE.
     */
    protected onFree(): void
    {
        this.linkedReferences?.unlinkAllRefs();
        this.onFreeListener?.clearingEmit();
    }

    private references = 1;
    private linkedReferences: ILinkedReferences | null = null;
    private onFreeListener: ITemporaryListener<[]> | null = null;
}

