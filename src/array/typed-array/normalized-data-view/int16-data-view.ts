import { INormalizedDataView } from "./i-normalized-data-view";

export class Int16DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number
    {
        return dataView.getInt16(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void
    {
        dataView.setInt16(ptr, value, littleEndian);
    }
}