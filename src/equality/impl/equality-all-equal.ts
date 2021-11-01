/**
 * @public
 * Returns true if all items are triple equal `===`.
 * @remarks
 * See {@link equalityAllEqual}.
 */
export function equalityAllEqual<TItem>(items: ArrayLike<TItem>): boolean
{
    if (items.length === 0)
    {
        return false;
    }

    const first = items[0];

    for (let i = 1, iEnd = items.length; i < iEnd; ++i)
    {
        if (items[i] !== first)
        {
            return false;
        }
    }

    return true;
}