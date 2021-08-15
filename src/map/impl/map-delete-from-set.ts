/**
 * @public
 * Used with maps that store sets. Where a set exists for a given key the value will be removed from that set.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to remove.
 * @remarks
 * See {@link (mapDeleteFromSet: 1)}.
 */
export function mapDeleteFromSet<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue): void;
/**
 * @public
 * Used with maps that store sets. Where a set exists for a given key the value will be removed from that set.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to push.
 * @remarks
 * See {@link (mapDeleteFromSet: 2)}.
 */
export function mapDeleteFromSet<TKey extends object, TValue>(map: WeakMap<TKey, Set<TValue>>, key: TKey, value: TValue): void;
export function mapDeleteFromSet<TKey extends object, TValue>
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
        values.delete(value);
    }
}