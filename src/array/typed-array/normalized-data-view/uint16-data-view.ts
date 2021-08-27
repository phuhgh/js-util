import { INormalizedDataView } from "./i-normalized-data-view";
import { isLittleEndian } from "../../../web-assembly/is-little-endian";

export class Uint16DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian: boolean = Uint16DataView.littleEndian): number
    {
        return dataView.getUint16(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian: boolean = Uint16DataView.littleEndian): void
    {
        dataView.setUint16(ptr, value, littleEndian);
    }

    private static littleEndian = isLittleEndian;
}