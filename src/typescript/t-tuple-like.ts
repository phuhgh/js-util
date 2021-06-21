/**
 * @public
 * Tuple version of ArrayLike.
 */
export type TTupleLike<TIndexes extends number, TValue, TLength extends number> =
    { [I in TIndexes]: TValue }
    & { length: TLength };