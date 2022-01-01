import { CircularBuffer } from "./circular-buffer";
import { _Production } from "../production/_production";
import { IFIFOStack } from "./i-fifo-stack";

/**
 * @public
 * Sets the behavior of {@link CircularFIFOStack} when a value is pushed which won't fit.
 *
 * @remarks
 * Does not affect underflow, which is always considered exceptional.
 */
export enum ECircularStackOverflowMode
{
    /**
     * Do nothing.
     */
    NoOp = 1,
    /**
     * Throw an error if the buffer overflows.
     */
    Exception,
    /**
     * Overwrite the first value.
     */
    Overwrite,
    /**
     * Doubles the stack size and copies in place, running in O(size).
     */
    Grow,
}

/**
 * @public
 * Circular first in first out stack.
 *
 * @remarks
 * See {@link ECircularStackOverflowMode} for details of overflow behavior.
 */
export class CircularFIFOStack<TValue> implements IFIFOStack<TValue>
{
    public constructor
    (
        capacity: number,
        mode: ECircularStackOverflowMode = ECircularStackOverflowMode.Grow,
    )
    {
        this.capacity = capacity;
        this.mode = mode;
        this.buffer = CircularBuffer.createEmpty(capacity);
    }

    public getCapacity(): number
    {
        return this.capacity;
    }

    /**
     * Pushes a value to the top of the stack (depending on `mode`).
     */
    public push(value: TValue): void
    {
        if (this.start + this.buffer.size == this.end)
        {
            switch (this.mode)
            {
                case ECircularStackOverflowMode.NoOp:
                    return;

                case ECircularStackOverflowMode.Exception:
                    throw _Production.createError("Attempted to push to full stack.");
                    break;

                case ECircularStackOverflowMode.Overwrite:
                    this.pop();
                    break;

                case ECircularStackOverflowMode.Grow:
                    this.growStack();
                    break;

                default:
                    _Production.assertValueIsNever(this.mode);

            }
        }

        this.buffer.setValue(this.end++, value);
    }

    /**
     * Remove the bottom element in the stack and return it.
     *
     * @remarks
     * Attempting to pop an empty stack is considered exceptional regardless of `mode`. You can
     * call `getIsEmpty` or `getRemainingCapacity` to determine if pop is safe to call.
     */
    public pop(): TValue
    {
        if (this.getIsEmpty())
        {
            throw _Production.createError("Attempted to pop empty stack.");
        }

        // null out the value to avoid memory leaks
        return this.buffer.getSetValue(this.start++, null) as TValue;
    }

    public getIsEmpty(): boolean
    {
        return this.start == this.end;
    }

    public getRemainingCapacity(): number
    {
        return this.start + this.capacity - this.end;
    }

    private growStack(): void
    {
        const largerCircularStack = new CircularFIFOStack<TValue>(this.capacity * 2, this.mode);

        let size = this.capacity;

        while (size--)
        {
            const valueToCopy = this.pop();
            largerCircularStack.push(valueToCopy);
        }

        this.buffer = largerCircularStack.buffer;
        this.capacity *= 2;
        this.start = largerCircularStack.start;
        this.end = largerCircularStack.end;
    }

    private buffer: CircularBuffer<TValue | null>;
    private readonly mode: ECircularStackOverflowMode;
    private capacity: number;
    private start = 0;
    private end = 0;
}
