export function fpOnce<TArgs extends any[], TRet>(initialize: (...args: TArgs) => TRet): (...args: TArgs) => TRet
{
    let item: TRet;
    let initialized = false;

    return (...args) =>
    {
        if (initialized)
        {
            return item;
        }

        initialized = true;

        return item = initialize(...args);
    };
}