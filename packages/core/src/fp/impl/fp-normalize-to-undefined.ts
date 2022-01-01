/**
 * @public
 * Normalizes `null` input to `undefined`.
 *
 * @remarks
 * See {@link fpNormalizeToUndefined}.
 */
export function fpNormalizeToUndefined<TValue>(value: TValue): Exclude<TValue, null> | undefined
{
    if (value === null)
    {
        return undefined;
    }

    return value as Exclude<TValue, null> | undefined;
}