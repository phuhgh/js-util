import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import { AVec4 } from "./a-vec4";
import { TVec4CtorArgs } from "./vec4";

export class Vec4F32Factory<T extends AVec4<Float32Array>>
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
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        writeTo[0] = memoryDataView.getFloat32(pointer, littleEndian);
        writeTo[1] = memoryDataView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[2] = memoryDataView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[3] = memoryDataView.getFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, littleEndian);

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
        memoryDataView.setFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, writeFrom[2], littleEndian);
        memoryDataView.setFloat32(pointer += Float32Array.BYTES_PER_ELEMENT, writeFrom[3], littleEndian);
    }
}