import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { ATypedTupleFactory } from "../a-typed-tuple-factory.js";
import { TTypedArray } from "../t-typed-array.js";
import { IVec4Ctor, TVec4CtorArgs, Vec4 } from "./vec4.js";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view.js";

export class Vec4Factory<T extends Vec4<TTypedArray>>
    extends ATypedTupleFactory<T, TVec4CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec4CtorArgs>
{
    public constructor
    (
        private readonly ctor: IVec4Ctor<TTypedArray>,
        dataView: INormalizedDataView,
    )
    {
        super(4, ctor.BYTES_PER_ELEMENT, dataView);
    }

    public createOneEmpty(): T
    {
        return new this.ctor() as T;
    }

    public createOne
    (
        x: number,
        y: number,
        z: number,
        w: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = x;
        a[1] = y;
        a[2] = z;
        a[3] = w;

        return a;
    }

    public override copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = Vec4Factory.littleEndian,
    )
        : T
    {
        writeTo[0] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
        writeTo[1] = this.dataView.getValue(memoryDataView, pointer += this.bytesPerElement, littleEndian);
        writeTo[2] = this.dataView.getValue(memoryDataView, pointer += this.bytesPerElement, littleEndian);
        writeTo[3] = this.dataView.getValue(memoryDataView, pointer += this.bytesPerElement, littleEndian);

        return writeTo;
    }

    public override copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: Readonly<T>,
        pointer: number,
        littleEndian: boolean = Vec4Factory.littleEndian,
    )
        : void
    {
        this.dataView.setValue(memoryDataView, pointer, writeFrom[0], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.bytesPerElement, writeFrom[1], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.bytesPerElement, writeFrom[2], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.bytesPerElement, writeFrom[3], littleEndian);
    }
}