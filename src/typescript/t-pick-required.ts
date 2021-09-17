/**
 * @public
 * Like `Required` but allows specification of required properties.
 */
export type TPickRequired<T, K extends keyof T> =
    & T
    & Required<Pick<T, K>>
    ;