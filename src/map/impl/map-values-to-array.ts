export function mapValuesToArray<TKey, TValue>(map: Map<TKey, TValue>): TValue[]
{
    return Array.from(map.values());
}