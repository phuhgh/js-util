/**
 * @public
 * Converts a `Map` into an `Array` of its key value pairs.
 *
 * @returns An array of tuples, the first value corresponding to the key and the second to the value.
 *
 * @remarks
 * See {@link mapEntriesToArray}.
 */
export function mapEntriesToArray<TKey, TValue>(map: Map<TKey, TValue>): [TKey, TValue][]
{
    return Array.from(map.entries());
}