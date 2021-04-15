/**
 * @public
 * Replaces length 0 `ArrayLike` with `undefined`.
 * @returns `array` if it's an `ArrayLike` of length greater than 0, otherwise `undefined`.
 *
 * @remarks
 * See {@link arrayNormalizeEmptyToUndefined}.
 */
export function arrayNormalizeEmptyToUndefined<TArray extends ArrayLike<any>>
(
    array: TArray | null | undefined
)
    : TArray | undefined
{
    if (array == null || array.length === 0)
    {
        return undefined;
    }

    return array;
}