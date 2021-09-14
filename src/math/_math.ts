import { mathMin } from "./impl/math-min";
import { mathMax } from "./impl/math-max";
import { mathBound } from "./impl/math-bound";
import { mathBoundRandom } from "./impl/math-bound-random";
import { mathHypot2 } from "./impl/math-hypot";

/**
 * @public
 * Utilities relating to math.
 */
export class _Math
{
    /** {@inheritDoc mathBound} */
    public static readonly bound = mathBound;

    /** {@inheritDoc mathBoundRandom} */
    public static readonly boundRandom = mathBoundRandom;

    /** {@inheritDoc mathHypot2} */
    public static readonly hypot2 = mathHypot2;

    /** {@inheritDoc mathMin} */
    public static readonly min = mathMin;

    /** {@inheritDoc mathMax} */
    public static readonly max = mathMax;

    private constructor()
    {
    }
}