export class Debug
{
    public static runBlock(cb: () => void): boolean
    {
        cb();
        return true;
    }

    public static assert(condition: boolean, errorMessage: string): void
    {
        if (!condition)
        {
            throw new Error(`assert fail: ${errorMessage}`);
        }
    }
}