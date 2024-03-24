/**
 * @public
 */
export type TProperty<K extends string | number | symbol, TValue> = {
    [P in K]: TValue;
};