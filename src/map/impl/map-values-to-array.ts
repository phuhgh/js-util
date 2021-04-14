/**
 * @public
 * Converts a `Map` into an `Array` of its values.
 *
 * @returns The values of `map`.
 *
 * @remarks
 * See {@link mapValuesToArray}.
 */
export function mapValuesToArray<TKey, TValue>(map: Map<TKey, TValue>): TValue[]
{
    return Array.from(map.values());
}