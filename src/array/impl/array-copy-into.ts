import { _Debug } from "../../debug/_debug";

/**
 * @public
 * Make an array contain the same items as another.
 * @param from - The array to copy from.
 * @param to - The array to copy into and resize.
 * @param startIndex - The index to start with in the from array.
 * @param length - The index to end with in the from array.
 *
 * @remarks
 * See {@link arrayCopyInto}.
 */
export function arrayCopyInto<TItem>
(
    from: ArrayLike<TItem>,
    to: TItem[],
    startIndex: number = 0,
    length: number = from.length
)
    : void
{
    const end = startIndex + length;
    to.length = length;

    _BUILD.DEBUG && _Debug.runBlock(() =>
    {
        _Debug.assert(startIndex >= 0, "negative indexes are not supported");
        _Debug.assert(end <= from.length, "length would overflow array");
    });

    for (let i = 0; startIndex < end; ++startIndex, ++i)
    {
        to[i] = from[startIndex];
    }
}