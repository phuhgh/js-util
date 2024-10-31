import { fpIdentity } from "./impl/fp-identity.js";
import { fpNormalizeToNull } from "./impl/fp-normalize-to-null.js";
import { fpNormalizeToUndefined } from "./impl/fp-normalize-to-undefined.js";
import { fpOnce } from "./impl/fp-once.js";
import { fpNoOp } from "./impl/fp-no-op.js";
import { fpValueOrNull } from "./impl/fp-value-or-null.js";
import { fpMaybeNewValue } from "./impl/fp-maybe-new-value.js";
import { fpDebounce } from "./impl/fp-debounce.js";
import { fpRunWithin } from "./impl/fp-run-within.js";

/**
 * @public
 * Utilities for functional programming.
 */
export class _Fp
{
    /** {@inheritDoc fpDebounce} */
    public static readonly debounce = fpDebounce;

    /** {@inheritDoc fpIdentity} */
    public static readonly identity = fpIdentity;

    /** {@inheritDoc fpMaybeNewValue} */
    public static readonly maybeNewValue = fpMaybeNewValue;

    /** {@inheritDoc fpNoOp} */
    public static readonly noOp = fpNoOp;

    /** {@inheritDoc fpNormalizeToNull} */
    public static readonly normalizeToNull = fpNormalizeToNull;

    /** {@inheritDoc fpNormalizeToUndefined} */
    public static readonly normalizeToUndefined = fpNormalizeToUndefined;

    /** {@inheritDoc fpOnce} */
    public static readonly once = fpOnce;

    /** {@inheritDoc fpRunWithin} */
    public static readonly runWithin = fpRunWithin;

    /** {@inheritDoc fpValueOrNull} */
    public static readonly valueOrNull = fpValueOrNull;

    private constructor()
    {
    }
}
