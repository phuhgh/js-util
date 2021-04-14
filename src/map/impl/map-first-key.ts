/**
 * @public
 * Gets the first inserted key in a `Map`.
 *
 * @returns The first key in `map`, otherwise `undefined` where size 0.
 *
 * @remarks
 * See {@link mapFirstKey}.
 */
export function mapFirstKey<K, V>(map: Map<K, V>): K | undefined
{
    return map
        .keys()
        .next()
        .value as K;
}