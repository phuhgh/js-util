/**
 * @public
 * Used with maps that store sets. Where a set exists for a given key the value will be added to that set, otherwise a new set will be created containing the value.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to add.
 * @returns true - If the value was added.
 * @remarks
 * See {@link (mapAddToSet: 1)}.
 */
export function mapReportingAddToSet<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey, value: TValue): boolean;
/**
 * @public
 * {@inheritDoc (mapAddToSet: 1)}
 * */
export function mapReportingAddToSet<TKey extends object, TValue>(map: WeakMap<TKey, Set<TValue>>, key: TKey, value: TValue): boolean;
export function mapReportingAddToSet<TKey extends object, TValue>
(
    map: Map<TKey, Set<TValue>> | WeakMap<TKey, Set<TValue>>,
    key: TKey,
    value: TValue,
)
    : boolean
{
    const values = map.get(key);

    if (values != null)
    {
        if (values.has(value))
        {
            return false;
        }
        else
        {
            values.add(value);
            return true;
        }
    }
    else
    {
        const set = new Set<TValue>();
        set.add(value);
        map.set(key, set);

        return true;
    }
}