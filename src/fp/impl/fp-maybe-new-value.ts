/**
 * @public
 * Returns the newValue if defined, else the old value.
 *
 * @remarks
 * See {@link fpMaybeNewValue}.
 */
export function fpMaybeNewValue<TValue>(newValue: TValue | null | undefined, oldValue: TValue): TValue
{
    if (newValue != null)
    {
        return newValue;
    }

    return oldValue;
}