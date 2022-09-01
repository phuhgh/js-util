import { INormalizedDataView } from "./i-normalized-data-view.js";
import { isLittleEndian } from "../../../web-assembly/is-little-endian.js";

export class Int16DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian: boolean = Int16DataView.littleEndian): number
    {
        return dataView.getInt16(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian: boolean = Int16DataView.littleEndian): void
    {
        dataView.setInt16(ptr, value, littleEndian);
    }

    private static littleEndian = isLittleEndian;
}