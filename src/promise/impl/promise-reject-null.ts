/**
 * @public
 * Returns a Promise of rejection with the supplied error if the value is `null` or `undefined`.
 *
 * @remarks
 * See {@link promiseRejectNull}.
 */
export async function promiseRejectNull<T>(value: Promise<T> | T, error: unknown): Promise<Exclude<T, null | undefined>>
{
    const result = await value;

    if (result == null)
    {
        return Promise.reject(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
    return result as any;
}