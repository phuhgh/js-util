/**
 * @public
 * Returns a map with keys from both A and B. If both A and B have the same key the value from B will be used.
 *
 * @remarks
 * See {@link mapUnion}.
 */
export function mapUnion<TKey, TIem>
(
    a: ReadonlyMap<TKey, TIem>,
    b: ReadonlyMap<TKey, TIem>,
)
    : Map<TKey, TIem>
{
    const result = new Map<TKey, TIem>();

    a.forEach((item, key) => result.set(key, item));
    b.forEach((item, key) => result.set(key, item));

    return result;
}