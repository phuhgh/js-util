/**
 * @param map - writing into this, but only if the key is null / undefined
 * @param key - the key to set in the map
 * @param getValue - only called if empty
 */
export function mapInitializeGet<TKey, TValue>
(
    map: Map<TKey, TValue>,
    key: TKey, getValue: (key: TKey) => TValue
)
    : TValue
{
    let value = map.get(key);

    if (value != null)
    {
        return value;
    }

    value = getValue(key);

    map.set(key, value);

    return value;
}