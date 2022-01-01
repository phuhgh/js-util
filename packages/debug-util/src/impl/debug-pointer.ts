import { _Debug } from "./_debug";

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
            `WASM address: ${["0x", this.pointer.toString(16).toUpperCase()].join("")}`,
            `Js constructor name: ${this.objectConstructor.name}`,
            "\nCall site stack trace follows:",
            this.creationCallstack,
        ];

        if (this.instanceLabel != null)
        {
            lines.splice(2, 0, `Instance label : ${this.instanceLabel}`);
        }

        return lines.join("\n");
    }
}