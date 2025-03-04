/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TMaybeObject<T extends Record<string, any>> = T | Partial<Record<keyof T, never>>;
