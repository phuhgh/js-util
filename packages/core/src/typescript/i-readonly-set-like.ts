/**
 * @public
 */
export interface IReadonlySetLike<TItem>
{
    has(item: TItem): boolean;
}