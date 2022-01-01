import { TTypedArray } from "./t-typed-array";
import { ATypedArrayTuple } from "./a-typed-array-tuple";

/**
 * @public
 */
export type TExtractTypeTypedArrayTuple<T extends ATypedArrayTuple<number, TTypedArray>> = T["TTypeGuardTypedArray"];