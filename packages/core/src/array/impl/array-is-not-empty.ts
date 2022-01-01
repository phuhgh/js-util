/**
 * @public
 * Returns true if the argument is not null, undefined or empty. Type narrows to `TArray` where true.
 *
 * @returns true if the argument is a non-zero length array.
 *
 * @remarks
 * See {@link arrayIsNotEmpty}.
 */
export function arrayIsNotEmpty<TArray extends ArrayLike<unknown>>
(
    items: TArray | null | undefined,
)
    : items is TArray
{
    if (items == null)
    {
        return false;
    }

    return items.length !== 0;
}