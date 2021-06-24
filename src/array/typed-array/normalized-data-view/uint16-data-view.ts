import { INormalizedDataView } from "./i-normalized-data-view";

export class Uint16DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian?: boolean): number
    {
        return dataView.getUint16(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian?: boolean): void
    {
        dataView.setUint16(ptr, value, littleEndian);
    }
}