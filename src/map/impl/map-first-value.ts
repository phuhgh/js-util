/**
 * @public
 * Gets the first inserted value in a `Map`.
 *
 * @returns The first value in `map`, otherwise `undefined` where size 0.
 *
 * @remarks
 * See {@link mapFirstValue}.
 */
export function mapFirstValue<K, V>(map: Map<K, V>): V | undefined
{
    return map
        .values()
        .next()
        .value as V;
}