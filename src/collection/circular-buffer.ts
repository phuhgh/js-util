export class CircularBuffer<TValue>
{
    public static createEmpty<TValue>(size: number): CircularBuffer<TValue>
    {
        return new CircularBuffer<TValue>(new Array(size));
    }

    public static createOne<TValue>(initialValues: TValue[]): CircularBuffer<TValue>
    {
        return new CircularBuffer<TValue>(initialValues);
    }

    public getValue(index: number): TValue
    {
        return this.values[this.getAdjustedIndex(index)];
    }

    public setValue(index: number, value: TValue): void
    {
        this.values[this.getAdjustedIndex(index)] = value;
    }

    protected constructor
    (
        private readonly values: TValue[],
    )
    {
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