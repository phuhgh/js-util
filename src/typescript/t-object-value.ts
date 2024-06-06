
/**
 * @public
 * Infers the value type of `TDictionary`, if it resembles a dictionary.
 */
export type TObjectValue<TDictionary extends object> = TDictionary[keyof TDictionary];