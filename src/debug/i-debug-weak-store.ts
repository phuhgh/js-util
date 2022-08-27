/**
 * @public
 * A weakmap store available in debug contexts only.
 */
export interface IDebugWeakStore<T>
{
    setValue(key: object, value: T): void;
    deleteValue(listener: object): void;
    getValue(key: object): T;
}