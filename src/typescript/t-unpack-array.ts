/**
 * @public
 */
export type TUnpackArray<T extends any[]> = T extends readonly (infer U)[] ? U : never;