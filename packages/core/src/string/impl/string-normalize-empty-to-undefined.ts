/**
 * @public
 * Replaces length 0 strings with `undefined`.
 * @returns `input` if it's a `string` of length greater than 0, otherwise `undefined`.
 *
 * @remarks
 * See {@link stringNormalizeEmptyToUndefined}.
 */
export function stringNormalizeEmptyToUndefined(input: string | null | undefined): string | undefined
{
    if (input == null)
    {
        return undefined;
    }

    if (input.length === 0)
    {
        return undefined;
    }

    return input;
}