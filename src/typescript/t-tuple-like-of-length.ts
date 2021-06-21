import { TTupleLike } from "./t-tuple-like";
import { TNextInt } from "./t-next-int";

/**
 * @public
 * Useful for homogenous tuples of arbitrary length.
 *
 * @remarks
 * Tuples past size of Mat4 will decay to array type for compile time reasons.
 */
export type TTupleLikeOfLength<TItem, TLength extends number, TCounter extends number = 0, TKeys extends number = 0> =
    TCounter extends TLength
        ? TTupleLike<TKeys, TItem, TLength>
        : TCounter extends 17
        ? TTupleLike<number, TItem, TLength>
        : TTupleLikeOfLength<TItem, TLength, TNextInt<TCounter>, TKeys | TCounter>
    ;