import { INormalizedDataView } from "./i-normalized-data-view";
import { _RunTime } from "@rc-js-util/core/bin/run-time/_run-time";

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

    private static littleEndian = _RunTime.isLittleEndian;
}
