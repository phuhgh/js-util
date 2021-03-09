import { arrayCopyInto } from "../array/impl/array-copy-into";

/**
 * @public
 * Presents an array as if it were circular, going past the end or start loops around.
 *
 * @remarks
 * Supports negative indexes.
 */
export class CircularBuffer<TValue>
{
    public readonly size: number;

    public static createEmpty<TValue>(size: number): CircularBuffer<TValue>
    {
        return new CircularBuffer<TValue>(new Array(size));
    }

    public static createOne<TValue>(initialValues: TValue[]): CircularBuffer<TValue>
    {
        return new CircularBuffer<TValue>(initialValues);
    }

    public clone(): CircularBuffer<TValue>
    {
        const clone = CircularBuffer.createEmpty<TValue>(this.size);
        arrayCopyInto(this.values, clone.values);

        return clone;
    }

    public getValue(index: number): TValue
    {
        return this.values[this.getAdjustedIndex(index)];
    }

    public setValue(index: number, value: TValue): void
    {
        this.values[this.getAdjustedIndex(index)] = value;
    }

    /**
     * returns the value stored at the index and sets the provided value
     */
    public getSetValue(index: number, value: TValue): TValue
    {
        const adjustedIndex = this.getAdjustedIndex(index);
        const previousValue = this.values[adjustedIndex];
        this.values[adjustedIndex] = value;

        return previousValue;
    }

    protected constructor
    (
        private readonly values: TValue[],
    )
    {
        this.size = values.length;
    }

    private getAdjustedIndex(index: number): number
    {
        const length = this.values.length;
        const remainder = index % length;

        if (remainder >= 0)
        {
            return remainder;
        }

        return length + remainder;
    }
}