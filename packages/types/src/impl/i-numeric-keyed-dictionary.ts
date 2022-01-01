/**
 * @public
 */
export interface INumericKeyedDictionary<T>
{
    readonly [n: number]: T;
}