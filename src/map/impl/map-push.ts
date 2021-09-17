/**
 * @public
 * Used with maps that store arrays. Where an array exists for a given key the value will be appended to that array, otherwise a new array will be created containing the value.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to push.
 * @remarks
 * See {@link (mapPush: 1)}.
 */
export function mapPush<TKey, TValue>(map: Map<TKey, TValue[]>, key: TKey, value: TValue): void;
/**
 * @public
 * Used with maps that store arrays. Where an array exists for a given key the value will be appended to that array, otherwise a new array will be created containing the value.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to push.
 * @remarks
 * See {@link (mapPush: 2)}.
 */
export function mapPush<TKey extends object, TValue>(map: WeakMap<TKey, TValue[]>, key: TKey, value: TValue): void;
export function mapPush<TKey extends object, TValue>
(
    map: Map<TKey, TValue[]> | WeakMap<TKey, TValue[]>,
    key: TKey,
    value: TValue,
)
    : void
{
    const values = map.get(key);

    if (values != null)
    {
        values.push(value);
    }
    else
    {
        map.set(key, [value]);
    }
}