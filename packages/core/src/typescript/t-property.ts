/**
 * @public
 */
export type TProperty<K extends string, TValue> = {
    [P in K]: TValue;
};