import { INormalizedDataView } from "./i-normalized-data-view";
import { isLittleEndian } from "../../../web-assembly/is-little-endian";

export class Float32DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian: boolean = Float32DataView.littleEndian): number
    {
        return dataView.getFloat32(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian = Float32DataView.littleEndian): void
    {
        dataView.setFloat32(ptr, value, littleEndian);
    }

    private static littleEndian = isLittleEndian;
}