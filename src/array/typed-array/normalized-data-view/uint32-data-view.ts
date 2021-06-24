import { INormalizedDataView } from "./i-normalized-data-view";

export class Uint32DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number
    {
        return dataView.getUint32(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void
    {
        dataView.setUint32(ptr, value, littleEndian);
    }
}