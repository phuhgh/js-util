import { setValuesToArray } from "./impl/set-values-to-array";
import { setSymmetricDifference } from "./impl/set-symmetric-difference";
import { setSetDifference } from "./impl/set-set-difference";
import { setIsSetEqual } from "./impl/set-is-set-equal";

/**
 * @public
 * Utilities that apply to `Set`.
 */
export class _Set
{
    /** {@inheritDoc setSetDifference} */
    public static readonly isSetEqual = setIsSetEqual;

    /** {@inheritDoc setSetDifference} */
    public static readonly setDifference = setSetDifference;

    /** {@inheritDoc setValuesToArray} */
    public static readonly valuesToArray = setValuesToArray;

    /** {@inheritDoc setSymmetricDifference} */
    public static readonly symmetricDifference = setSymmetricDifference;

    private constructor()
    {
    }
}