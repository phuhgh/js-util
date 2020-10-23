export async function fpRejectFalse(value: Promise<boolean> | boolean, error: unknown): Promise<void>
{
    const result = await value;

    if (!result)
    {
        return Promise.reject(error);
    }
}