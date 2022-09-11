import { _Debug } from "../../debug/_debug.js";
import { IReferenceCounted } from "../../lifecycle/a-reference-counted.js";

// todo jack: export const in globals
export const allocationStack: unknown[][] = [];

/**
 * @public
 */
export class LifecycleStack
{
    public push(): IReferenceCounted[]
    {
        const top: IReferenceCounted[] = [];
        this.allocationStack.push(top);
        return top;
    }

    public pop(): IReferenceCounted[]
    {
        _BUILD.DEBUG && _Debug.assert(this.allocationStack.length > 0, "attempted to pop empty stack");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.allocationStack.pop()!;
    }

    public register(ref: IReferenceCounted): void
    {
        const top = this.allocationStack[this.allocationStack.length - 1];

        if (top == null)
        {
            return;
        }

        top.push(ref);
    }

    public getSize(): number
    {
        return this.allocationStack.length;
    }

    private readonly allocationStack = allocationStack as IReferenceCounted[][];
}

/**
 * @public
 */
export const lifecycleStack = new LifecycleStack();
