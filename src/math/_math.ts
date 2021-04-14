import { mathMin } from "./impl/math-min";
import { mathMax } from "./impl/math-max";
import { mathBound } from "./impl/math-bound";

/**
 * @public
 * Utilities relating to math.
 */
// tslint:disable-next-line:class-name
export class _Math
{
    /** {@inheritDoc mathMin} */
    public static readonly min = mathMin;

    /** {@inheritDoc mathMax} */
    public static readonly max = mathMax;

    /** {@inheritDoc mathBound} */
    public static readonly bound = mathBound;

    private constructor()
    {
    }
}