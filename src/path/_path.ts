import { pathJoin } from "./impl/path-join";

/**
 * @public
 * File path manipulation utilities.
 */
export class _Path
{
    /** {@inheritDoc pathJoin} */
    public static readonly join = pathJoin;

    private constructor()
    {
    }
}