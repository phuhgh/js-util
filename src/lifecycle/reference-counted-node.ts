import type { IBroadcastChannel } from "../eventing/i-broadcast-channel.js";
import { BroadcastChannel } from "../eventing/broadcast-channel.js";
import { type IManagedResourceLinks, ManagedResourceLinks } from "./managed-resource-links.js";
import { _Debug } from "../debug/_debug.js";
import type { IManagedResourceNode } from "./manged-resources.js";

/**
 * @internal
 */
export class ReferenceCountedNode implements IManagedResourceNode
{
    public readonly onFreeChannel: IBroadcastChannel<"onFree", []> = new BroadcastChannel("onFree");

    public onClaimed(): void
    {
        if (this.references <= 0)
        {
            _BUILD.DEBUG && _Debug.error("object has been released already");
            return;
        }

        ++this.references;
    }


    public onReleased(): void
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

    public getLinked(): IManagedResourceLinks
    {
        if (this.linkedReferences == null)
        {
            return this.linkedReferences = new ManagedResourceLinks(this);
        }

        return this.linkedReferences;
    }

    private onFree(): void
    {
        this.linkedReferences?.unlinkAll();
        this.onFreeChannel.emit();
    }

    protected linkedReferences: IManagedResourceLinks | null = null;
    private references = 1;
}
