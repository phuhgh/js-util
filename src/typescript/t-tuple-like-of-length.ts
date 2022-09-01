import { TTupleLike } from "./t-tuple-like.js";
import { TNextInt } from "./t-next-int.js";

/**
 * @public
 * Useful for homogenous tuples of arbitrary length.
 *
 * @remarks
 * Tuples past size of Mat4 will decay to array type for compile time reasons.
 */
export type TTupleLikeOfLength<TItem
    , TLength extends number
    , TCounter extends number = 0
    , TIndexes extends number = never>
    =
    TCounter extends TLength
        ? TTupleLike<TIndexes, TItem, TLength>
        : TCounter extends 16
            ? TTupleLike<number, TItem, number>
            : TTupleLikeOfLength<TItem, TLength, TNextInt<TCounter>, TIndexes | TCounter>
    ;