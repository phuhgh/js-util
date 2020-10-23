export function mapPush<TKey, TValue>(map: Map<TKey, TValue[]>, key: TKey, value: TValue): void
{
    const values = map.get(key);

    if (values != null)
    {
        values.push(value);
    }
    else
    {
        map.set(key, [value]);
    }
}