import { treeIterate } from "./impl/tree-iterate.js";
import { treeCollect } from "./impl/tree-collect.js";

/**
 * @public
 * Utilities that apply to tree like structures.
 */
export class _Tree
{
    /** {@inheritDoc treeIterate} */
    public static readonly iterate = treeIterate;
    /** {@inheritDoc treeCollect} */
    public static readonly collect = treeCollect;

    private constructor()
    {
    }
}