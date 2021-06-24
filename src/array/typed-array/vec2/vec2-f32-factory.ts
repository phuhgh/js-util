import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import type { EArrayTypeGuard } from "../e-typed-array-guard";
import { AVec2 } from "./a-vec2";
import { TVec2CtorArgs } from "./vec2";

export class Vec2F32Factory<T extends AVec2<EArrayTypeGuard.F32>>
    extends AF32TupleFactory<T, TVec2CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec2CtorArgs>
{
    public constructor()
    {
        super(2);
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
        writeTo[0] = memoryDataView.getFloat32(pointer, littleEndian);
        writeTo[1] = memoryDataView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);

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
        memoryDataView.setFloat32(pointer, writeFrom[0], littleEndian);
        memoryDataView.setFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, writeFrom[1], littleEndian);
    }
}