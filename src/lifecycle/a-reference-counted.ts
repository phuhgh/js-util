import { _Debug } from "../debug/_debug.js";
import { ILinkedReferences, LinkedReferences } from "./linked-references.js";
import type { IBroadcastChannel } from "../eventing/i-broadcast-channel.js";
import { BroadcastChannel } from "../eventing/broadcast-channel.js";
import type { IManagedResource } from "./i-managed-resource.js";

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 */
export interface IReferenceCounted extends IManagedResource
{
    readonly onFreeChannel: IBroadcastChannel<"onFree", []>;

    /**
     * Increments the ref count.
     */
    claim(): void;
    /**
     * Decrements the ref count.
     */
    release(): void;

    getIsDestroyed(): boolean;
    getLinkedReferences(): ILinkedReferences;
}

/**
 * @public
 * Provides a way to handle cleanup of manually managed resources where there is not a single owner.
 * NB The object is pre-claimed (ref count 1) on creation.
 */
export abstract class AReferenceCounted implements IReferenceCounted
{
    public readonly onFreeChannel: IBroadcastChannel<"onFree", []> = new BroadcastChannel("onFree");

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
     * You should only call `release` if you called `claim` first, except for the object creator, who automatically stakes a claim.
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

    /**
     * DO NOT CALL THIS DIRECTLY, CALL RELEASE.
     */
    protected onFree(): void
    {
        this.linkedReferences?.unlinkAllRefs();
        this.onFreeChannel.emit();
    }

    private references = 1;
    private linkedReferences: ILinkedReferences | null = null;
}

