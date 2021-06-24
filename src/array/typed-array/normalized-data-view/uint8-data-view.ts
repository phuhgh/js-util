import { INormalizedDataView } from "./i-normalized-data-view";

export class Uint8DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number): number
    {
        return dataView.getUint8(ptr);
    }

    public setValue(dataView: DataView, ptr: number, value: number): void
    {
        dataView.setUint8(ptr, value);
    }
}