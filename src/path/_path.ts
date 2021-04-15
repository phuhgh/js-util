import { pathJoin } from "./impl/path-join";

/**
 * @public
 * File path manipulation utilities.
 */
// tslint:disable-next-line:class-name
export class _Path
{
    /** {@inheritDoc pathJoin} */
    public static readonly join = pathJoin;

    private constructor()
    {
    }
}