/**
 * @public
 */
export type TPredicate<TPred extends boolean, TTrue, TFalse> = TPred extends true ? TTrue : TFalse;