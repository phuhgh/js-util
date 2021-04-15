/**
 * @public
 */
export type TUnionToIntersection<T> = ((T extends any ? (k: T) => void : never) extends ((k: infer U) => void) ? U : never);