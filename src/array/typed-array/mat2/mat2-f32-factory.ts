import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import { AMat2 } from "./a-mat2";
import { TMat2CtorArgs } from "./mat2";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

export class Mat2F32Factory<T extends AMat2<EArrayTypeGuard.F32>>
    extends AF32TupleFactory<T, TMat2CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat2CtorArgs>
{
    public constructor()
    {
        super(4);
    }

    public createOne
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