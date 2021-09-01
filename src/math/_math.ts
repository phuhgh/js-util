import { mathMin } from "./impl/math-min";
import { mathMax } from "./impl/math-max";
import { mathBound } from "./impl/math-bound";
import { mathBoundRandom } from "./impl/math-bound-random";

/**
 * @public
 * Utilities relating to math.
 */
export class _Math
{
    /** {@inheritDoc mathMin} */
    public static readonly min = mathMin;

    /** {@inheritDoc mathMax} */
    public static readonly max = mathMax;

    /** {@inheritDoc mathBound} */
    public static readonly bound = mathBound;

    /** {@inheritDoc mathBoundRandom} */
    public static readonly boundRandom = mathBoundRandom;

    private constructor()
    {
    }
}