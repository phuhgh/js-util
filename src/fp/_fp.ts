import { fpIdentity } from "./impl/fp-identity";
import { fpNormalizeToNull } from "./impl/fp-normalize-to-null";
import { fpNormalizeToUndefined } from "./impl/fp-normalize-to-undefined";
import { fpOnce } from "./impl/fp-once";
import { fpRejectFalse } from "./impl/fp-reject-false";
import { fpRejectNull } from "./impl/fp-reject-null";
import { fpNoOp } from "./impl/fp-no-op";

/**
 * @public
 * Utilities for functional programming.
 */
export class _Fp
{
    /** {@inheritDoc fpIdentity} */
    public static readonly identity = fpIdentity;

    /** {@inheritDoc fpNoOp} */
    public static readonly noOp = fpNoOp;

    /** {@inheritDoc fpNormalizeToNull} */
    public static readonly normalizeToNull = fpNormalizeToNull;

    /** {@inheritDoc fpNormalizeToUndefined} */
    public static readonly normalizeToUndefined = fpNormalizeToUndefined;

    /** {@inheritDoc fpOnce} */
    public static readonly once = fpOnce;

    /** {@inheritDoc fpRejectFalse} */
    public static readonly rejectFalse = fpRejectFalse;

    /** {@inheritDoc fpRejectNull} */
    public static readonly rejectNull = fpRejectNull;

    private constructor()
    {
    }
}
