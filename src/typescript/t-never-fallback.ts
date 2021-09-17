import { TNeverPredicate } from "./t-never-predicate";

/**
 * @public
 * If the value is never, return the fallback instead.
 */
export type TNeverFallback<TValue, TFallback> = TNeverPredicate<TValue, TFallback, TValue>;