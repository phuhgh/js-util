/**
 * @public
 * Circular first in first out stack.
 */
export interface IFIFOStack<TValue>
{
    getCapacity(): number;
    /**
     * Pushes a value to the front of the stack (depending on `mode`).
     */
    push(value: TValue): void;
    /**
     * Remove the first inserted element in the stack and return it.
     *
     * @remarks
     * Attempting to pop an empty stack is considered exceptional regardless of `mode`. You can
     * call `getIsEmpty` or `getRemainingCapacity` to determine if pop is safe to call.
     */
    pop(): TValue;
    getIsEmpty(): boolean;
    getRemainingCapacity(): number;
}