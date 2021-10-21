/**
 * @public
 */
export interface IReadonlyDictionary<T>
{
    readonly [index: string | symbol]: T;
}
