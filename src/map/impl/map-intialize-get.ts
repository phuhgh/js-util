/**
 * @public
 * Gets the value from a `Map` for a given key, where the value is `undefined` or hasn't been set, the callback's return will be inserted into the `Map` and returned.
 * @param map - The `Map` to search and modify.
 * @param key - The key to search for / set in `map`.
 * @param getValue - The function to call if a value is not found.
 * @returns The value in `map`, otherwise the result of the `getValue`.
 *
 * @remarks
 * See {@link (mapInitializeGet:1)}.
 */
export function mapInitializeGet<TMapKey, TKey extends TMapKey, TMapValue, TValue extends TMapValue>
(
    map: Map<TMapKey, TMapValue>,
    key: TKey,
    getValue: (key: TKey) => TValue,
)
    : TMapValue;

/**
 * @public
 * {@inheritDoc (mapInitializeGet: 1)}
 */
export function mapInitializeGet<TMapKey extends object, TKey extends TMapKey, TMapValue, TValue extends TMapValue>
(
    map: WeakMap<TMapKey, TMapValue>,
    key: TKey,
    getValue: (key: TKey) => TValue,
)
    : TMapValue;

export function mapInitializeGet<TKey extends object, TMapValue, TValue extends TMapValue>
(
    map: Map<TKey, TMapValue> | WeakMap<TKey, TMapValue>,
    key: TKey,
    getValue: (key: TKey) => TValue,
)
    : TMapValue
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