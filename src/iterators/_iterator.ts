import { iteratorConsumeAll } from "./impl/iterator-consume-all";
import { iteratorEmptyIterator } from "./impl/iterator-empty-iterator";

// noinspection JSUnusedLocalSymbols
/**
 * @public
 * Utilities relating to `IterableIterator` & generators.
 */
export class _Iterator
{
    /** {@inheritDoc iteratorEmptyIterator} */
    public static emptyIterator = iteratorEmptyIterator;

    /** {@inheritDoc iteratorConsumeAll} */
    public static readonly consumeAll = iteratorConsumeAll;

    private constructor()
    {
        // no extensions allows
    }
}

