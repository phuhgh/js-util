import { mathMin } from "./impl/math-min.js";
import { mathMax } from "./impl/math-max.js";
import { mathBound } from "./impl/math-bound.js";
import { mathBoundRandom } from "./impl/math-bound-random.js";
import { mathHypot2 } from "./impl/math-hypot.js";

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