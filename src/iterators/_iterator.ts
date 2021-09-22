import { iteratorConsumeAll } from "./impl/iterator-consume-all";
import { iteratorEmptyIterator } from "./impl/iterator-empty-iterator";

// noinspection JSUnusedLocalSymbols
/**
 * @public
 */
export class _Iterator
{
    /** {@inheritDoc iteratorEmptyIterator} */
    public static emptyIterator = iteratorEmptyIterator;

    /** {@inheritDoc iteratorConsumeAll} */
    public static consumeAll = iteratorConsumeAll;

    private constructor()
    {
        // no extensions allows
    }
}

