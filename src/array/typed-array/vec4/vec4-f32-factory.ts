import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import { AVec4 } from "./a-vec4";
import { TVec4CtorArgs } from "./vec4";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

export class Vec4F32Factory<T extends AVec4<EArrayTypeGuard.F32>>
    extends AF32TupleFactory<T, TVec4CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec4CtorArgs>
{
    public constructor()
    {
        super(4);
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
        bufferView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        writeTo[0] = bufferView.getFloat32(pointer, littleEndian);
        writeTo[1] = bufferView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[2] = bufferView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[3] = bufferView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);

        return writeTo;
    }

    public override copyToBuffer
    (
        bufferView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        bufferView.setFloat32(pointer, writeFrom[0], littleEndian);
        bufferView.setFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, writeFrom[1], littleEndian);
        bufferView.setFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, writeFrom[2], littleEndian);
        bufferView.setFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, writeFrom[3], littleEndian);
    }
}