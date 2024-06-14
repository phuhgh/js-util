/**
 * @public
 */
export interface ITreeNodeLike<T extends ITreeNodeLike<T>>
{
    getChildren(): readonly T[] | null;
}