/**
 * @public
 * Used with maps that store sets. Where a set exists for a given key the value will be removed from that set.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to remove.
 * @returns true - If value was removed.
 *
 * @remarks
 * See {@link (mapDeleteFromSet: 1)}.
 */
export function mapDeleteFromSet<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue): boolean;
/**
 * @public
 * {@inheritDoc (mapDeleteFromSet: 1)}
 */
export function mapDeleteFromSet<TKey extends object, TValue>(map: WeakMap<TKey, Set<TValue>>, key: TKey, value: TValue): boolean;
export function mapDeleteFromSet<TKey extends object, TValue>
(
    map: Map<TKey, Set<TValue>> | WeakMap<TKey, Set<TValue>>,
    key: TKey,
    value: TValue,
)
    : boolean
{
    const values = map.get(key);

    if (values == null)
    {
        return false;
    }
    else
    {
        return values.delete(value);
    }
}