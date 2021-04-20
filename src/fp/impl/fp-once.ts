/**
 * @public
 * Creates a function that can be called many times but will run at most once.
 *
 * @remarks
 * See {@link fpOnce}.
 */
export function fpOnce<TArgs extends unknown[], TRet>(initialize: (...args: TArgs) => TRet): (...args: TArgs) => TRet
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