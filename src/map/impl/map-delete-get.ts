/**
 * @public
 * Get the stored value if present, then delete the key.
 *
 * @remarks
 * See {@link mapDeleteGet}.
 */
export function mapDeleteGet<TKey, TValue>
(
    map: Map<TKey, TValue>,
    key: TKey,
)
    : TValue | undefined
{
    const value = map.get(key);
    map.delete(key);

    return value;
}