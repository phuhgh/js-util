/**
 * @public
 * A function that will be called in a way which makes using `this` unsafe. Doesn't affect lambdas.
 */
export interface IContextlessFn<TArg extends readonly unknown[], TRet>
{
    (this: unknown, ...args: TArg): TRet;
}
