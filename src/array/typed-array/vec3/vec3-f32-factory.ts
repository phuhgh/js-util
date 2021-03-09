import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import type { EArrayTypeGuard } from "../e-typed-array-guard";
import { AVec3 } from "./a-vec3";
import { TVec3CtorArgs } from "./vec3";

export class Vec3F32Factory<T extends AVec3<EArrayTypeGuard.F32>>
    extends AF32TupleFactory<T, TVec3CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec3CtorArgs>
{
    public constructor()
    {
        super(3);
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
    }
}