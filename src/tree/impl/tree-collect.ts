import type { ITreeNodeLike } from "../tree-model.js";

/**
 * @public
 * Similar to a reducer, but without the return requirement. It otherwise behaves like {@link treeIterate}.
 *
 * @param node - The start point.
 * @param collected - The reduced value.
 * @param callback - Called for each node, including the start point.
 *
 * @remarks
 * See {@link treeCollect}.
 */
export function treeCollect<TRet, TNode extends ITreeNodeLike<TNode>>
(
    node: TNode,
    collected: TRet,
    callback: (collected: TRet, node: TNode, parent: TNode | null, depth: number) => void,
)
    : TRet
{
    callback(collected, node, null, 0);
    treeRecurseImpl(collected, node, node.getChildren(), 1, callback);
    return collected;
}

function treeRecurseImpl<TRet, TNode extends ITreeNodeLike<TNode>>
(
    collected: TRet,
    parent: TNode | null,
    children: readonly TNode[] | null,
    depth: number,
    callback: (collected: TRet, node: TNode, parent: TNode | null, depth: number) => void,
)
    : void
{
    if (children == null)
    {
        return;
    }

    for (let i = 0, iEnd = children.length; i < iEnd; i++)
    {
        const node = children[i];
        callback(collected, node, parent, depth);

        treeRecurseImpl(collected, node, node.getChildren(), depth + 1, callback);
    }
}