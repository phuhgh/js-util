/**
 * @public
 * Used with maps that store arrays. Where an array exists for a given key the values will be appended to that array, otherwise a copy of values array will be inserted.
 * @param map - The `Map` to check. May be modified.
 * @param key - The key to lookup in `map`.
 * @param values - The values to concat.
 *
 * @remarks
 * See {@link (mapConcat: 1)}.
 */
export function mapConcat<TKey, TValue>(map: Map<TKey, TValue[]>, key: TKey, values: readonly TValue[]): void;
/**
 * @public
 * {@inheritDoc (mapConcat: 1)}
 */
export function mapConcat<TKey extends object, TValue>(map: WeakMap<TKey, TValue[]>, key: TKey, values: readonly TValue[]): void;
export function mapConcat<TKey extends object, TValue>
(
    map: Map<TKey, TValue[]> | WeakMap<TKey, TValue[]>,
    key: TKey,
    valuesToConcat: readonly TValue[],
)
    : void
{
    const values = map.get(key);

    if (values != null)
    {
        map.set(key, values.concat(valuesToConcat));
    }
    else
    {
        map.set(key, valuesToConcat.slice());
    }
}