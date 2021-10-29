import { equalityAreConsistentlyDefined } from "./impl/equality-are-consistently-defined";

/**
 * @public
 * Non-standard equality tests.
 */
export class _Equality
{
    /** {@inheritDoc equalityAreConsistentlyDefined} */
    public static areConsistentlyDefined = equalityAreConsistentlyDefined;
}