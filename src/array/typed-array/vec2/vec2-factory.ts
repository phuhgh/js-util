import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AVec2 } from "./a-vec2";
import { TVec2CtorArgs } from "./vec2";
import { ATypedTupleFactory } from "../a-typed-tuple-factory";
import { TTypedArrayCtor } from "../t-typed-array-ctor";

export class Vec2Factory<T extends AVec2<InstanceType<TCtor>>, TCtor extends TTypedArrayCtor>
    extends ATypedTupleFactory<T, TVec2CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec2CtorArgs>
{
    public constructor
    (
        ctor: TCtor,
    )
    {
        super(2, ctor);
    }

    public createOne
    (
        x: number,
        y: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = x;
        a[1] = y;

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
    }
}