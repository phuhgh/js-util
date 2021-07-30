import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { INormalizedDataView } from "./normalized-data-view/i-normalized-data-view";
import { ATypedArrayTuple } from "./a-typed-array-tuple";
import { TTypedArray } from "./t-typed-array";
import { TExtractTypeTypedArrayTuple } from "../../typescript/t-extract-type-typed-array-tuple";

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

    public castToBaseType(typedArrayTuple: Readonly<TArray>): TExtractTypeTypedArrayTuple<TArray>
    {
        return typedArrayTuple as unknown as TExtractTypeTypedArrayTuple<TArray>;
    }

    public abstract createOne(...args: TCtorArgs): TArray;

    public abstract createOneEmpty(): TArray;

    public clone(typedArrayTuple: Readonly<TArray>): TArray
    {
        return typedArrayTuple.slice() as unknown as TArray;
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