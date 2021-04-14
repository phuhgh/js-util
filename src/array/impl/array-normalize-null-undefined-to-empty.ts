/**
 * @public
 * Replaces `null` / `undefined` with an empty `Array`.
 * @returns `array` if it's an `Array` of length greater than 0, otherwise an empty `Array`.
 *
 * @remarks
 * See {@link arrayNormalizeNullUndefinedToEmpty}.
 */
export function arrayNormalizeNullUndefinedToEmpty<TItem>(array: TItem[] | null | undefined): TItem[]
{
    if (array == null)
    {
        return [];
    }

    return array;
}