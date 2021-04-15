/**
 * @public
 * Converts a `Map` into an `Array` of its keys.
 *
 * @returns The keys of the map.
 *
 * @remarks
 * See {@link mapKeysToArray}.
 */
export function mapKeysToArray<TKey, TValue>(map: Map<TKey, TValue>): TKey[]
{
    return Array.from(map.keys());
}