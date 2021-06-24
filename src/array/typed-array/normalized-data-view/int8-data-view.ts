import { INormalizedDataView } from "./i-normalized-data-view";

export class Int8DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number): number
    {
        return dataView.getInt8(ptr);
    }

    public setValue(dataView: DataView, ptr: number, value: number): void
    {
        dataView.setInt8(ptr, value);
    }
}