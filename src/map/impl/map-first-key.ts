export function mapFirstKey<K, V>(map: Map<K, V>): K | undefined
{
    return map
        .keys()
        .next()
        .value as K;
}