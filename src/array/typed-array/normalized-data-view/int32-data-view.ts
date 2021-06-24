import { INormalizedDataView } from "./i-normalized-data-view";

export class Int32DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number
    {
        return dataView.getInt32(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void
    {
        dataView.setInt32(ptr, value, littleEndian);
    }
}