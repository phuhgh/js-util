/**
 * @public
 * Like `Array.map` but with a `Map` input. Outputs an `Array`.
 *
 * @returns An array of mapped values.
 *
 * @remarks
 * See {@link mapArrayMap}.
 */
export function mapArrayMap<TKey, TValue, TMapped>
(
    map: Map<TKey, TValue>,
    callback: (value: TValue, key: TKey) => TMapped
)
    : TMapped[]
{
    const mapped = new Array<TMapped>(map.size);
    let index = 0;

    map.forEach((v, k) => mapped[index++] = callback(v, k));

    return mapped;
}