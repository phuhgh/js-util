import { INormalizedDataView } from "./i-normalized-data-view";

export class Float64DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number
    {
        return dataView.getFloat64(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void
    {
        dataView.setFloat64(ptr, value, littleEndian);
    }
}