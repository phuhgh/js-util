import { IDictionary } from "./i-dictionary.js";

/**
 * @public
 * Infers the value type of `IDictionary`.
 */
export type TDictionaryValue<TDictionary> = TDictionary extends IDictionary<infer U> ? U : never;
