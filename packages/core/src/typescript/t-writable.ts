/**
 * @public
 * Removes readonly from an object.
 */
export type TWriteable<T> = { -readonly [P in keyof T]: T[P] };