import { equalityAreConsistentlyDefined } from "./impl/equality-are-consistently-defined";
import { equalityAllEqual } from "./impl/equality-all-equal";

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