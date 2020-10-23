export async function fpRejectNull<T>(value: Promise<T> | T, error: unknown): Promise<Exclude<T, null | undefined>>
{
    const result = await value;

    if (result == null)
    {
        return Promise.reject(error);
    }

    return result as Exclude<T, null | undefined>;
}