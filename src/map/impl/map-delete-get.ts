/**
 * @public
 * Get the stored value if present, then delete the key.
 *
 * @remarks
 * See {@link (mapDeleteGet: 1)}.
 */
export function mapDeleteGet<TKey, TValue>(map: Map<TKey, TValue>, key: TKey): TValue | undefined;
/**
 * @public
 * Get the stored value if present, then delete the key.
 *
 * @remarks
 * See {@link (mapDeleteGet: 2)}.
 */
export function mapDeleteGet<TKey extends object, TValue>(map: WeakMap<TKey, TValue>, key: TKey): TValue | undefined;
export function mapDeleteGet<TKey extends  object, TValue>
(
    map: Map<TKey, TValue> | WeakMap<TKey, TValue>,
    key: TKey,
)
    : TValue | undefined
{
    const value = map.get(key);
    map.delete(key);

    return value;
}