import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { INormalizedDataView } from "./normalized-data-view/i-normalized-data-view";
import { ATypedArrayTuple } from "./a-typed-array-tuple";

export abstract class ATypedTupleFactory<TArray extends object, TCtorArgs extends number[]>
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

    public clone(typedArrayTuple: Readonly<TArray>): TArray
    {
        return (typedArrayTuple as unknown as ATypedArrayTuple<number>).slice() as unknown as TArray;
    }

    public copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: TArray = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : TArray
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
        writeFrom: Readonly<TArray>,
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