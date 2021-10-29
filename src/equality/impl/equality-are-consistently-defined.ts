/**
 * @public
 * Returns true if both `A` and `B` are both null, undefined or 'defined'. Defined is not null and not undefined.
 */
export function equalityAreConsistentlyDefined<T>
(
    a: T | undefined | null,
    b: T | undefined | null
)
    : boolean
{
    if (a == null)
    {
        if (a === undefined)
        {
            return b === undefined;
        }
        else
        {
            return b === null;
        }
    }
    else
    {
        return b != null;
    }
}