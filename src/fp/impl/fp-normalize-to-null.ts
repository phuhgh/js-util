/**
 * @public
 * Normalizes `undefined` input to `null`.
 *
 * @remarks
 * See {@link fpNormalizeToNull}.
 */
export function fpNormalizeToNull<TValue>(value: TValue): Exclude<TValue, undefined> | null
{
    if (value === undefined)
    {
        return null;
    }

    return value as Exclude<TValue, undefined> | null;
}