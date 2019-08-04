import { mathMin } from "./impl/math-min";
import { mathMax } from "./impl/math-max";
import { mathBound } from "./impl/math-bound";

// tslint:disable-next-line:class-name
export class _Math
{
    public static readonly min = mathMin;
    public static readonly max = mathMax;
    public static readonly bound = mathBound;

    private constructor()
    {
    }
}