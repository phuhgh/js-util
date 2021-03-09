/**
 * @public
 */
export type TUnpackArray<T extends ArrayLike<unknown>> = T extends ArrayLike<infer U> ? U : never;