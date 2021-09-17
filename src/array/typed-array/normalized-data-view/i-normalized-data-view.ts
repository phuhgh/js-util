/**
 * @public
 * Provides a way to set a value on a `DataView` without needing to know the types at the point of setting. Use
 * {@link NormalizedDataViewProvider} to get an instance.
 *
 * @remarks
 * Does not performs any sort of bounds checking, overflow is entirely the consumers concern.
 */
export interface INormalizedDataView
{
    getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number;
    setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void;
}