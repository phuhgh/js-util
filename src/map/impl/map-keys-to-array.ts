export function mapKeysToArray<TKey, TValue>(map: Map<TKey, TValue>): TKey[]
{
    return Array.from(map.keys());
}