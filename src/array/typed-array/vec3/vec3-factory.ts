import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { IVec3Ctor, TVec3CtorArgs, Vec3 } from "./vec3.js";
import { ATypedTupleFactory } from "../a-typed-tuple-factory.js";
import { TTypedArray } from "../t-typed-array.js";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view.js";

export class Vec3Factory<T extends Vec3<TTypedArray>>
    extends ATypedTupleFactory<T, TVec3CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec3CtorArgs>
{
    public constructor
    (
        private ctor: IVec3Ctor<TTypedArray>,
        dataView: INormalizedDataView,
    )
    {
        super(3, ctor.BYTES_PER_ELEMENT, dataView);
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
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = x;
        a[1] = y;
        a[2] = z;

        return a;
    }

    public override copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = Vec3Factory.littleEndian,
    )
        : T
    {
        writeTo[0] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
        writeTo[1] = this.dataView.getValue(memoryDataView, pointer += this.bytesPerElement, littleEndian);
        writeTo[2] = this.dataView.getValue(memoryDataView, pointer += this.bytesPerElement, littleEndian);

        return writeTo;
    }

    public override copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: Readonly<T>,
        pointer: number,
        littleEndian: boolean = Vec3Factory.littleEndian,
    )
        : void
    {
        this.dataView.setValue(memoryDataView, pointer, writeFrom[0], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.bytesPerElement, writeFrom[1], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.bytesPerElement, writeFrom[2], littleEndian);
    }
}