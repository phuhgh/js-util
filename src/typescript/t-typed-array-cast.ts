import { ATypedArrayTuple } from "../array/typed-array/a-typed-array-tuple.js";
import { TPickExcept } from "./t-pick-except.js";
import { TTypedArray } from "../array/typed-array/t-typed-array.js";

/**
 * @public
 * Typed array tuples of the same dimension but different storage type (e.g. float32 vs int32) are not structurally
 * compatible by design. Where an implicit conversion is desired you can cast between typed array tuples of the same
 * dimension using this utility type as described in the example.
 *
 * @example
 * ```typescript
 * const vec4 = Vec4.f32.factory.createOneEmpty();
 * type TVec4I32 = AVec4<TTypedArray.I32>;
 * const ivec4: TVec4I32 = vec4 as TTypedArrayCast<TVec4I32> as TVec4I32;
 * ```
 */
export type TTypedArrayCast<U extends ATypedArrayTuple<number, TTypedArray>> = TPickExcept<U, "TTypeGuardTypedArray" | keyof ATypedArrayTuple<number, TTypedArray>>;