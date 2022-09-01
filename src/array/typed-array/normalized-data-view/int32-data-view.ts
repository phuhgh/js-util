import { INormalizedDataView } from "./i-normalized-data-view.js";
import { isLittleEndian } from "../../../web-assembly/is-little-endian.js";

export class Int32DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian: boolean = Int32DataView.littleEndian): number
    {
        return dataView.getInt32(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian: boolean = Int32DataView.littleEndian): void
    {
        dataView.setInt32(ptr, value, littleEndian);
    }

    private static littleEndian = isLittleEndian;
}