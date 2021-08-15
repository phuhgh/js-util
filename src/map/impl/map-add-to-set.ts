/**
 * @public
 * Used with maps that store sets. Where a set exists for a given key the value will be added to that set, otherwise a new set will be created containing the value.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to add.
 * @remarks
 * See {@link (mapAddToSet: 1)}.
 */
export function mapAddToSet<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue): void;
/**
 * @public
 * Used with maps that store arrays. Where an array exists for a given key the value will be appended to that array, otherwise a new array will be created containing the value.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to push.
 * @remarks
 * See {@link (mapAddToSet: 2)}.
 */
export function mapAddToSet<TKey extends object, TValue>(map: WeakMap<TKey, Set<TValue>>, key: TKey, value: TValue): void;
export function mapAddToSet<TKey extends object, TValue>
(
    map: Map<TKey, Set<TValue>> | WeakMap<TKey, Set<TValue>>,
    key: TKey,
    value: TValue,
)
    : void
{
    const values = map.get(key);

    if (values != null)
    {
        values.add(value);
    }
    else
    {
        const set = new Set<TValue>();
        set.add(value);
        map.set(key, set);
    }
}