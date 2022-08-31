import { _Debug } from "./_debug";
import { IDebugWeakStore } from "./i-debug-weak-store";

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

    public deleteValue(listener: object): void
    {
        this.values.delete(listener);
    }

    public getValue(listener: object): T
    {
        _BUILD.DEBUG && _Debug.assert(this.values.has(listener), "expected to find value");
        return this.values.get(listener) as T;
    }
}