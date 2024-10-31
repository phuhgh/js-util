import { _Debug } from "./_debug.js";
import type { IManagedObject, IManagedResourceNode, PointerDebugMetadata } from "../lifecycle/manged-resources.js";
import { numberGetHexString } from "../number/impl/number-get-hex-string.js";
import { arrayInsertAtIndex } from "../array/impl/array-insert-at-index.js";

/**
 * @public
 * Wrapper of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry} for shared objects,
 * useful for checking if the shared object was properly disposed. Available in debug contexts only.
 */
export class DebugSharedObjectLifeCycleChecker
{
    public registerFinalizationCheck(sharedObject: IManagedObject, metadata: PointerDebugMetadata | null): void
    {
        const debugPointer = metadata == null
            ? null
            : new DebugPointer(metadata.address, sharedObject.constructor);

        // associate the debug information along with the shared object
        this.finalizationRegistry.register(sharedObject, [sharedObject.resourceHandle, debugPointer]);
    }

    private finalizationRegistry = new FinalizationRegistry(([node, maybePtr]: [IManagedResourceNode, DebugPointer | null]) =>
    {
        // the `sharedObject` has been destroyed, we get the tuple we associated in `registerFinalizationCheck`
        if (!node.getIsDestroyed())
        {
            // the object has leaked...
            if (maybePtr != null)
            {
                _Debug.error(["A shared object was leaked:", maybePtr.toString()].join("\n"));
            }
            else
            {
                // RIP
                _Debug.error("A shared object was leaked, but we don't have any information about it...");
            }
        }
    });
}

class DebugPointer
{
    public readonly creationCallstack: string;

    public constructor
    (
        public readonly address: number,
        public readonly objectConstructor: Function,
        public readonly instanceLabel: string | undefined = _Debug.label,
    )
    {
        this.creationCallstack = _Debug.getStackTrace();
    }

    public toString(): string
    {
        const lines = [
            `WASM address: ${numberGetHexString(this.address)}`,
            `Js constructor name: ${this.objectConstructor.name}`,
            "\nCall site stack trace follows:",
            this.creationCallstack,
        ];

        if (this.instanceLabel != null)
        {
            arrayInsertAtIndex(lines, `Instance label : ${this.instanceLabel}`, 2);
        }

        return lines.join("\n");
    }
}