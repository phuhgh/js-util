import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { INormalizedDataView } from "./normalized-data-view/i-normalized-data-view";

export abstract class ATypedTupleFactory<T extends object, TCtorArgs extends number[]>
    implements ITypedArrayTupleFactory<T, TCtorArgs>
{
    protected constructor
    (
        protected readonly length: number,
        protected readonly bytesPerElement: number,
        protected dataView: INormalizedDataView,
    )
    {
    }

    public abstract createOne(...args: TCtorArgs): T;

    public abstract createOneEmpty(): T;

    public copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            (writeTo as unknown as number[])[i] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
            pointer += this.bytesPerElement;
        }

        return writeTo;
    }

    public copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            this.dataView.setValue(memoryDataView, pointer, (writeFrom as unknown as number[])[i], littleEndian);
            pointer += this.bytesPerElement;
        }
    }
}