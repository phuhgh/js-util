import type { ITreeNodeLike } from "../tree-model.js";

/**
 * @public
 * Iterates over the whole tree, in a depth first fashion.
 *
 * @param node - The start point.
 * @param callback - Called for each node, including the start point.
 *
 * @remarks
 * See {@link treeIterate}.
 */
export function treeIterate<TNode extends ITreeNodeLike<TNode>>
(
    node: TNode,
    callback: (node: TNode, parent: TNode | null, depth: number) => void,
)
    : void
{
    callback(node, null, 0);
    treeRecurseImpl(node, node.getChildren(), 1, callback);
}

function treeRecurseImpl<TNode extends ITreeNodeLike<TNode>>
(
    parent: TNode | null,
    children: readonly TNode[] | null,
    depth: number,
    callback: (node: TNode, parent: TNode | null, depth: number) => void,
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
        callback(node, parent, depth);

        treeRecurseImpl(node, node.getChildren(), depth + 1, callback);
    }
}