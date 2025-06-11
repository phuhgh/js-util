// todo jack: pretty questionable
/**
 * @public
 * Returns `TTrue` if `TExts` extends `TBase`, else `TFalse` (default never).
 */
export type TSubtypePredicate<TBase, TExts, TTrue, TFalse = never> = TExts extends TBase ? TTrue : TFalse;

/**
 * @public
 * If you see this, the type you supplied isn't a subtype of `TBase`.
 */
export type TSubtypeAssertError = {
    compileError: true;
    notSubtype: true;
};