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