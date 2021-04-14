/**
 * @public
 * Gets the last value in `ArrayLike`.
 *
 * @returns The first value in `map`, otherwise `undefined` where size 0.
 *
 * @remarks
 * See {@link mapFirstValue}.
 */
export function arrayLast<TItem>(items: ArrayLike<TItem>): TItem | undefined
{
    if (items.length === 0)
    {
        return undefined;
    }

    return items[items.length - 1];
}