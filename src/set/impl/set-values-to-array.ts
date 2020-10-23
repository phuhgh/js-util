export function setValuesToArray<TItem>(set: Set<TItem>): TItem[]
{
    return Array.from(set.values());
}