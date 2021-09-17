/**
 * @public
 * If TTest is never, return TTrue, else TFalse.
 */
export type TNeverPredicate<TTest, TTrue, TFalse> = (() => TTest) extends () => never ? TTrue : TFalse;


