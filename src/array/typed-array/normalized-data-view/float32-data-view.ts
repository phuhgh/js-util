import { INormalizedDataView } from "./i-normalized-data-view";

export class Float32DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number
    {
        return dataView.getFloat32(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void
    {
        dataView.setFloat32(ptr, value, littleEndian);
    }
}