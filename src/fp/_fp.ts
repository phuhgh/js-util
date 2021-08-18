import { fpIdentity } from "./impl/fp-identity";
import { fpNormalizeToNull } from "./impl/fp-normalize-to-null";
import { fpNormalizeToUndefined } from "./impl/fp-normalize-to-undefined";
import { fpOnce } from "./impl/fp-once";
import { fpNoOp } from "./impl/fp-no-op";
import { fpValueOrNull } from "./impl/fp-value-or-null";
import { fpMaybeNewValue } from "./impl/fp-maybe-new-value";
import { fpDebounce } from "./impl/fp-debounce";

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

    /** {@inheritDoc fpValueOrNull} */
    public static readonly valueOrNull = fpValueOrNull;

    private constructor()
    {
    }
}
