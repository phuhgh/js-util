/**
 * @public
 * Returns a Promise of rejection with the supplied error if the `value` is false.
 *
 * @remarks
 * See {@link promiseRejectFalse}.
 */
export async function promiseRejectFalse(value: Promise<boolean> | boolean, error: unknown): Promise<void>
{
    const result = await value;

    if (result === false)
    {
        return Promise.reject(error);
    }
}