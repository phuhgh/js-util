/**
 * @public
 * Returns the newValue if defined, else the old value.
 */
export function fpMaybeNewValue<TValue>(newValue: TValue | null | undefined, oldValue: TValue): TValue
{
    if (newValue != null)
    {
        return newValue;
    }

    return oldValue;
}