/**
 * @public
 * Replaces `null` / `undefined` with an empty `string`.
 * @returns `input` if it's a `string` of length greater than 0, otherwise an empty `string`.
 *
 * @remarks
 * See {@link stringNormalizeNullUndefinedToEmpty}.
 */
export function stringNormalizeNullUndefinedToEmpty(input: string | null | undefined): string
{
    if (input == null)
    {
        return "";
    }

    return input;
}