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