import { _Debug } from "./_debug.js";
import { numberGetHexString } from "../number/impl/number-get-hex-string.js";
import { arrayInsertAtIndex } from "../array/impl/array-insert-at-index.js";

export class DebugPointer
{
    public readonly creationCallstack: string;

    public constructor
    (
        public readonly pointer: number,
        public readonly objectConstructor: Function,
        public readonly isStatic: boolean,
        public readonly instanceLabel: string | undefined = _Debug.label,
    )
    {
        this.creationCallstack = _Debug.getStackTrace();
    }

    public toString(): string
    {
        const lines = [
            `WASM address: ${numberGetHexString(this.pointer)}`,
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