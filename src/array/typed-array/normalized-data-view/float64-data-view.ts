import { INormalizedDataView } from "./i-normalized-data-view";
import { isLittleEndian } from "../../../web-assembly/is-little-endian";

export class Float64DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian: boolean = Float64DataView.littleEndian): number
    {
        return dataView.getFloat64(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian: boolean = Float64DataView.littleEndian): void
    {
        dataView.setFloat64(ptr, value, littleEndian);
    }

    private static littleEndian = isLittleEndian;
}