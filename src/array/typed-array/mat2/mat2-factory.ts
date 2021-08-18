import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { ATypedTupleFactory } from "../a-typed-tuple-factory";
import { TTypedArray } from "../t-typed-array";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { Mat2, IMat2Ctor, TMat2CtorArgs } from "./mat2";

export class Mat2Factory<T extends Mat2<TTypedArray>>
    extends ATypedTupleFactory<T, TMat2CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat2CtorArgs>
{
    public constructor
    (
        private readonly ctor: IMat2Ctor<TTypedArray>,
        dataView: INormalizedDataView,
    )
    {
        super(4, ctor.BYTES_PER_ELEMENT, dataView);
    }

    public override createOne
    (
        c1r1: number,
        c1r2: number,
        c2r1: number,
        c2r2: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = c1r1;
        a[1] = c1r2;
        a[2] = c2r1;
        a[3] = c2r2;

        return a as T;
    }

    public override createOneEmpty(): T
    {
        return new this.ctor() as T;
    }

    public override copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        writeTo[0] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
        writeTo[1] = this.dataView.getValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[2] = this.dataView.getValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[3] = this.dataView.getValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, littleEndian);

        return writeTo;
    }

    public override copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: Readonly<T>,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        this.dataView.setValue(memoryDataView, pointer, writeFrom[0], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, writeFrom[1], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, writeFrom[2], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, writeFrom[3], littleEndian);
    }
}