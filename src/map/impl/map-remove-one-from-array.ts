import { arrayRemoveOne } from "../../array/impl/array-remove-one.js";

/**
 * @public
 * Used with maps that store arrays. Where an array exists for a given key the value will be removed from that array.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param value - The value to remove.
 * @returns true - If value was removed.
 *
 * @remarks
 * See {@link (mapRemoveOneFromArray: 1)}.
 */
export function mapRemoveOneFromArray<TKey, TValue>(map: Map<TKey, TValue[]>, key: TKey, value: TValue): boolean;
/**
 * @public
 * {@inheritDoc (mapRemoveOneFromArray: 1)}
 */
export function mapRemoveOneFromArray<TKey extends object, TValue>(map: WeakMap<TKey, TValue[]>, key: TKey, value: TValue): boolean;
export function mapRemoveOneFromArray<TKey extends object, TValue>
(
    map: Map<TKey, TValue[]> | WeakMap<TKey, TValue[]>,
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
        return arrayRemoveOne(values, value);
    }
}