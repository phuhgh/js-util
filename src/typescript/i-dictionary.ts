/**
 * @public
 */
export interface IDictionary<T>
{
    [index: string | symbol]: T;
}