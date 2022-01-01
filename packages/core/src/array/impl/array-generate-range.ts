import { arrayMapRange } from "./array-map-range";
import { fpIdentity } from "../../fp/impl/fp-identity";

/**
 * @public
 * Generates a range of integers output in an `Array`.
 *
 * @param from - The value to start from (inclusive).
 * @param to - The value to finish with (inclusive).
 *
 * @returns An array [from, from + 1, ..., to -1, to].
 *
 * @remarks
 * Where `from` and `to` are equal a length 1 array is returned, NaN input is not supported.
 *
 * See {@link arrayGenerateRange}.
 */
export function arrayGenerateRange(from: number, to: number): number[]
{
    return arrayMapRange(from, to, fpIdentity);
}