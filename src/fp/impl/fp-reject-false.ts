/**
 * @public
 * Returns a Promise of rejection with the supplied error if the `value` is falsy.
 *
 * @remarks
 * See {@link fpRejectFalse}.
 */
export async function fpRejectFalse(value: Promise<boolean> | boolean, error: unknown): Promise<void>
{
    const result = await value;

    if (!result)
    {
        return Promise.reject(error);
    }
}