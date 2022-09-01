import { arrayRemoveMany } from "../../array/impl/array-remove-many.js";

/**
 * @public
 * Used with maps that store arrays. Where an array exists for a given key the values will be removed from that array.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param itemsToRemove - The values to remove.
 * @returns The number of items that were removed.
 *
 * @remarks
 * See {@link (mapRemoveManyFromArray: 1)}.
 */
export function mapRemoveManyFromArray<TKey, TValue>(map: Map<TKey, TValue[]>, key: TKey, itemsToRemove: TValue[]): number;
/**
 * @public
 * {@inheritDoc (mapRemoveManyFromArray: 1)}
 */
export function mapRemoveManyFromArray<TKey extends object, TValue>(map: WeakMap<TKey, TValue[]>, key: TKey, itemsToRemove: TValue[]): number;
export function mapRemoveManyFromArray<TKey extends object, TValue>
(
    map: Map<TKey, TValue[]> | WeakMap<TKey, TValue[]>,
    key: TKey,
    itemsToRemove: TValue[],
)
    : number
{
    const values = map.get(key);

    if (values == null)
    {
        return 0;
    }
    else
    {
        return arrayRemoveMany(values, itemsToRemove);
    }
}