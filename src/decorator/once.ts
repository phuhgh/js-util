/**
 * @public
 * Method decorator. The target will be called only once, subsequent calls will return the first return.
 */
export function Once<TInstance extends object, TKey extends keyof TInstance>
(
    target: TInstance,
    key: TKey,
    descriptor: PropertyDescriptor,
)
    : void
{
    const original = target[key] as unknown as Function;
    const results = new WeakMap();

    target[key] = descriptor.value = function (this: object, ...args: unknown[]): unknown
    {
        if (results.has(this))
        {
            return results.get(this);
        }

        const result = original.apply(this, args) as unknown;
        results.set(this, result);

        return result;
    } as unknown as TInstance[TKey];
}
