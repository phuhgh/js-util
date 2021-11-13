/**
 * @public
 */
export type TPickExcept<TObj extends object, TKey extends keyof TObj> = Pick<TObj, Exclude<keyof TObj, TKey>>;
