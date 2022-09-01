import { equalityAreConsistentlyDefined } from "./impl/equality-are-consistently-defined.js";
import { equalityAllEqual } from "./impl/equality-all-equal.js";

/**
 * @public
 * Non-standard equality tests.
 */
export class _Equality
{
    /** {@inheritDoc equalityAllEqual} */
    public static allEqual = equalityAllEqual;
    /** {@inheritDoc equalityAreConsistentlyDefined} */
    public static areConsistentlyDefined = equalityAreConsistentlyDefined;
}