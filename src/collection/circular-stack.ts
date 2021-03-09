import { CircularBuffer } from "./circular-buffer";

// todo jack: Q, error handling, overwrite vs except vs noop
export class CircularStack<TValue>
{
    public static createEmpty<TValue>(size: number): CircularStack<TValue>
    {
        return new CircularStack<TValue>(size);
    }

    public push(value: TValue): void
    {
        this.buffer.setValue(this.end++, value);
    }

    public pop(): TValue | undefined
    {
        return this.buffer.getValue(this.start++);
    }

    protected constructor
    (
        size: number,
    )
    {
        this.buffer = CircularBuffer.createEmpty(size);
    }

    private readonly buffer: CircularBuffer<TValue>;
    private start = 0;
    private end = 0;
}