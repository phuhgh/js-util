import { TNeverFallback } from "./t-never-fallback";

/**
 * @public
 * Tuple version of ArrayLike.
 */
export type TTupleLike<TIndexes extends number, TValue, TLength extends number> =
    & { [I in TNeverFallback<TIndexes, number>]: TValue }
    & { length: TLength }
    ;