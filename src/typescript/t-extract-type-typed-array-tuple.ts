import { ATypedArrayTuple } from "../array/typed-array/a-typed-array-tuple.js";
import { TTypedArray } from "../array/typed-array/t-typed-array.js";

/**
 * @public
 */
export type TExtractTypeTypedArrayTuple<T extends ATypedArrayTuple<number, TTypedArray>> = T["TTypeGuardTypedArray"];