import { ATypedArrayTuple } from "../array/typed-array/a-typed-array-tuple";
import { TTypedArray } from "../array/typed-array/t-typed-array";

/**
 * @public
 */
export type TExtractTypeTypedArrayTuple<T extends ATypedArrayTuple<number, TTypedArray>> = T["TTypeGuardTypedArray"];