import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { INormalizedDataView } from "./normalized-data-view/i-normalized-data-view";
import { ATypedArrayTuple } from "./a-typed-array-tuple";
import { TTypedArray } from "./t-typed-array";
import { isLittleEndian } from "../../web-assembly/is-little-endian";

export abstract class ATypedTupleFactory<TArray extends ATypedArrayTuple<number, TTypedArray>, TCtorArgs extends number[]>
    implements ITypedArrayTupleFactory<TArray, TCtorArgs>
{
    protected constructor
    (
        protected readonly length: number,
        protected readonly bytesPerElement: number,
        protected dataView: INormalizedDataView,
    )
    {
    }

    public abstract createOne(...args: TCtorArgs): TArray;

    public abstract createOneEmpty(): TArray;

    public copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: TArray = this.createOneEmpty(),
        littleEndian: boolean = ATypedTupleFactory.littleEndian,
    )
        : TArray
    {
        const bytesPerElement = this.bytesPerElement;

        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            (writeTo as unknown as number[])[i] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
            pointer += bytesPerElement;
        }

        return writeTo;
    }

    public copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: Readonly<TArray>,
        pointer: number,
        littleEndian: boolean = ATypedTupleFactory.littleEndian,
    )
        : void
    {
        const bytesPerElement = this.bytesPerElement;

        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            this.dataView.setValue(memoryDataView, pointer, (writeFrom as unknown as number[])[i], littleEndian);
            pointer += bytesPerElement;
        }
    }

    protected static littleEndian = isLittleEndian;
}
