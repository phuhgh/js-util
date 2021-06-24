import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AVec4 } from "./a-vec4";
import { TVec4CtorArgs } from "./vec4";
import { ATypedTupleFactory } from "../a-typed-tuple-factory";
import { TTypedArrayCtor } from "../t-typed-array-ctor";

export class Vec4Factory<T extends AVec4<InstanceType<TCtor>>, TCtor extends TTypedArrayCtor>
    extends ATypedTupleFactory<T, TVec4CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec4CtorArgs>
{
    public constructor
    (
        ctor: TCtor,
    )
    {
        super(4, ctor);
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

        return a as T;
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
        writeTo[1] = this.dataView.getValue(memoryDataView, pointer += this.ctor.BYTES_PER_ELEMENT, littleEndian);
        writeTo[2] = this.dataView.getValue(memoryDataView, pointer += this.ctor.BYTES_PER_ELEMENT, littleEndian);
        writeTo[3] = this.dataView.getValue(memoryDataView, pointer += this.ctor.BYTES_PER_ELEMENT, littleEndian);

        return writeTo;
    }

    public override copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        this.dataView.setValue(memoryDataView, pointer, writeFrom[0], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.ctor.BYTES_PER_ELEMENT, writeFrom[1], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.ctor.BYTES_PER_ELEMENT, writeFrom[2], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.ctor.BYTES_PER_ELEMENT, writeFrom[3], littleEndian);
    }
}