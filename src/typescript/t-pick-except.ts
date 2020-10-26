export type TPickExcept<TObj, TKey> = Pick<TObj, Exclude<keyof TObj, TKey>>;
