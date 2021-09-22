/**
 * @public
 * An iterator that is done.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const iteratorEmptyIterator: IterableIterator<any> & { result: { done: true, value: any } } = {
    [Symbol.iterator]()
    {
        return this;
    },
    next(): IteratorResult<number>
    {
        return this.result;
    },
    result: { done: true, value: null },
};