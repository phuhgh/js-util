/**
 * @public
 * Gets the value from a `Map` for a given key, where the value is `undefined` or hasn't been set, the callback's return will be inserted into the `Map` and returned.
 * @param map - The `Map` to search and modify.
 * @param key - The key to search for / set in `map`.
 * @param getValue - The function to call if a value is not found.
 * @returns The value in `map`, otherwise the result of the `getValue`.
 *
 * @remarks
 * See {@link mapInitializeGet}.
 */
export function mapInitializeGet<TKey, TValue>
(
    map: Map<TKey, TValue>,
    key: TKey,
    getValue: (key: TKey) => TValue,
)
    : TValue
{
    let value = map.get(key);

    if (value !== undefined)
    {
        return value;
    }

    value = getValue(key);

    map.set(key, value);

    return value;
}