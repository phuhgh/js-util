import { ISetLike } from "../../typescript/i-set-like.js";

/**
 * @public
 * Used with maps that store sets. Where a set exists for a given key the value will be removed from that set, if it is
 * empty after removal, then the set is deleted.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to remove.
 * @returns true - If value was removed.
 *
 * @remarks
 * See {@link (mapDeleteFromSet: 1)}.
 */
export function mapClearingDeleteFromSet<TKey, TValue>(map: Map<TKey, ISetLike<TValue>>, key: TKey, value: TValue): boolean;
/**
 * @public
 * {@inheritDoc (mapDeleteFromSet: 1)}
 */
export function mapClearingDeleteFromSet<TKey extends object, TValue>(map: WeakMap<TKey, ISetLike<TValue>>, key: TKey, value: TValue): boolean;
export function mapClearingDeleteFromSet<TKey extends object, TValue>
(
    map: Map<TKey, ISetLike<TValue>> | WeakMap<TKey, ISetLike<TValue>>,
    key: TKey,
    value: TValue,
)
    : boolean
{
    const values = map.get(key);

    if (values != null)
    {
        values.delete(value);

        if (values.size === 0)
        {
            map.delete(key);
        }

        return true;
    }

    return false;
}