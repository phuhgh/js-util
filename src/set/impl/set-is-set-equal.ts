/**
 * @public
 *
 * @remarks
 * See {@link setIsSetEqual}.
 */
export function setIsSetEqual<TItem>
(
    a: ReadonlySet<TItem>,
    b: ReadonlySet<TItem>,
)
    : boolean
{
    if (a.size !== b.size)
    {
        return false;
    }

    for (const item of a)
    {
        if (!b.has(item))
        {
            return false;
        }
    }

    return true;
}