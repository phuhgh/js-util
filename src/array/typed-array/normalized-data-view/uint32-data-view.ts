import { INormalizedDataView } from "./i-normalized-data-view.js";
import { isLittleEndian } from "../../../web-assembly/util/is-little-endian.js";

export class Uint32DataView implements INormalizedDataView
{
    public getValue(dataView: DataView, ptr: number, littleEndian: boolean = Uint32DataView.littleEndian): number
    {
        return dataView.getUint32(ptr, littleEndian);
    }

    public setValue(dataView: DataView, ptr: number, value: number, littleEndian: boolean = Uint32DataView.littleEndian): void
    {
        dataView.setUint32(ptr, value, littleEndian);
    }

    private static littleEndian = isLittleEndian;
}