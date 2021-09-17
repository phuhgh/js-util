/**
 * @public
 * Like `Partial` but allows specification of optional properties.
 */
export type TPickPartial<T, K extends keyof T> =
    & Pick<T, Exclude<keyof T, K>>
    & Partial<Pick<T, K>>
    ;