export function stringNormalizeNullUndefinedToEmpty(input: string | null | undefined): string
{
    if (input == null)
    {
        return "";
    }

    return input;
}