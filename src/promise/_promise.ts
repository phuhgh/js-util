import { promiseRejectFalsey } from "./impl/promise-reject-falsey.js";
import { promiseRejectNull } from "./impl/promise-reject-null.js";
import { promiseRejectFalse } from "./impl/promise-reject-false.js";
import { promiseDelay } from "./impl/promise-delay.js";
import { promisePoll } from "./impl/promise-poll.js";

/**
 * @public
 * Utilities for handling promises.
 */
export class _Promise
{
    /** {@inheritDoc promisePoll} */
    public static readonly poll = promisePoll;

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
