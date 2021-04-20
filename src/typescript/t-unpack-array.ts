/**
 * @public
 */
export type TUnpackArray<T extends unknown[]> = T extends readonly (infer U)[] ? U : never;