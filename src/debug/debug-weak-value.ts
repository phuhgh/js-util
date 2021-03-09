import { _Debug } from "./_debug";
import { IDebugWeakStore } from "rc-js-util-globals";

export class DebugWeakValue<T> implements IDebugWeakStore<T>
{
    public constructor
    (
        private values = new WeakMap<object, T>(),
    )
    {
    }

    public setValue(listener: object, value: T): void
    {
        this.values.set(listener, value);
    }

    public getValue(listener: object): T
    {
        DEBUG_MODE && _Debug.assert(this.values.has(listener), "expected to find value");
        return this.values.get(listener) as T;
    }
}