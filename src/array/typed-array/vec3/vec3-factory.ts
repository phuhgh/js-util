import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AVec3 } from "./a-vec3";
import { TVec3CtorArgs } from "./vec3";
import { ATypedTupleFactory } from "../a-typed-tuple-factory";
import { TTypedArrayCtor } from "../t-typed-array-ctor";

export class Vec3Factory<T extends AVec3<InstanceType<TCtor>>, TCtor extends TTypedArrayCtor>
    extends ATypedTupleFactory<T, TVec3CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec3CtorArgs>
{
    public constructor
    (
        ctor: TCtor,
    )
    {
        super(3, ctor);
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
    }
}