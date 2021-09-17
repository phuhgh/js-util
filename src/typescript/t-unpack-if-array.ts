/**
 * @public
 */
export type TUnpackIfArray<T> = T extends ArrayLike<infer U> ? U : never;