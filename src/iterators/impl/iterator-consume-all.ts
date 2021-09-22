/**
 * @public
 * Iterate over an iterator until it's done, discarding the results.
 */
export function iteratorConsumeAll(iterator: IterableIterator<unknown>): void
{
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (!iterator.next().done)
    {
        // no action needed
    }
}