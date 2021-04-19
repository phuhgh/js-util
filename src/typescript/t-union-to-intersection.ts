/**
 * @public
 */
export type TUnionToIntersection<T> = ((T extends unknown ? (k: T) => void : never) extends ((k: infer U) => void) ? U : never);