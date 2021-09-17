/**
 * @public
 * Returns the value if the predicate is true, else null.
 */
export function fpValueOrNull<TValue>(predicate: boolean, value: TValue): TValue | null
{
    if (predicate)
    {
        return value;
    }

    return null;
}