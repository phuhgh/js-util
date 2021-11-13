import { fpNoOp } from "../fp/impl/fp-no-op";

/**
 * @public
 * Weak reference counter.
 */
export class ReferenceCounter<TKey extends object>
{
    public constructor
    (
        private onZeroReference: (key: TKey) => void = fpNoOp,
    )
    {
    }

    public add(key: TKey): number
    {
        let count = this.store.get(key);
        count ??= 0;
        this.store.set(key, ++count);
        return count;
    }

    public remove(key: TKey): number
    {
        let count = this.store.get(key);

        if (count == null)
        {
            return 0;
        }

        if (count === 1)
        {
            this.onZeroReference(key);
            this.store.delete(key);
            return 0;
        }

        this.store.set(key, --count);
        return count;
    }

    private readonly store = new WeakMap<object, number>();
}