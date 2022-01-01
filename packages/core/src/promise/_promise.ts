import { promiseRejectFalsey } from "./impl/promise-reject-falsey";
import { promiseRejectNull } from "./impl/promise-reject-null";
import { promiseRejectFalse } from "./impl/promise-reject-false";
import { promiseDelay } from "./impl/promise-delay";

/**
 * @public
 * Utilities for handling promises.
 */
export class _Promise
{
    /** {@inheritDoc promiseDelay} */
    public static readonly delay = promiseDelay;

    /** {@inheritDoc promiseRejectFalse} */
    public static readonly rejectFalse = promiseRejectFalse;

    /** {@inheritDoc promiseRejectFalsey} */
    public static readonly rejectFalsey = promiseRejectFalsey;

    /** {@inheritDoc promiseRejectNull} */
    public static readonly rejectNull = promiseRejectNull;

    private constructor()
    {
    }
}
