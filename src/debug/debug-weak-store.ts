import { _Debug } from "./_debug.js";

/**
 * @public
 */
export class DebugWeakStore<TVal, TKey extends object = object>
{
    public constructor
    (
        private values = new WeakMap<TKey, TVal>(),
    )
    {
    }

    public setValue(key: TKey, value: TVal): void
    {
        this.values.set(key, value);
    }

    public deleteValue(key: TKey): void
    {
        this.values.delete(key);
    }

    public getValue(key: TKey): TVal
    {
        _BUILD.DEBUG && _Debug.assert(this.values.has(key), "expected to find value");
        return this.values.get(key) as TVal;
    }
}
