import { _Debug } from "./_debug.js";

/**
 * RAII edition of {@link _Debug.applyLabelCallback}, has creation side effect of applying the label.
 */
export class DebugLabelOwner implements Disposable
{
    public constructor(label: string | undefined)
    {
        _Debug.label = label;
    }

    public [Symbol.dispose](): void
    {
        _Debug.label = undefined;
    }
}