/**
 * @public
 */
export type TUnpackIfArray<T> = T extends readonly (infer U)[] ? U : never;