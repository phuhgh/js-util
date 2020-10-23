export function mapFirstValue<K, V>(map: Map<K, V>): V | undefined
{
    return map
        .values()
        .next()
        .value as V;
}