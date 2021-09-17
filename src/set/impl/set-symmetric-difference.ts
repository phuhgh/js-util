/**
 * @public
 *
 * @remarks
 * See {@link setSymmetricDifference}.
 */
export function setSymmetricDifference<TItem>(a: Set<TItem>, b: Set<TItem>): TItem[]
{
    const result: TItem[] = [];

    a.forEach((item) =>
    {
        if (!b.has(item))
        {
            result.push(item);
        }
    });

    b.forEach((item) =>
    {
        if (!a.has(item))
        {
            result.push(item);
        }
    });

    return result;
}