export function arrayNormalizeNullUndefinedToEmpty<TItem>(array: TItem[] | null | undefined): TItem[]
{
    if (array == null)
    {
        return [];
    }

    return array;
}