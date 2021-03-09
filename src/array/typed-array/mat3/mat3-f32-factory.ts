import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat3F32, TMat3CtorArgs } from "./mat3-f32";

// extracted to allow for future extension, webgl only supports float32 matrices so no point right now
export class Mat3F32Factory<T extends Mat3F32>
    implements ITypedArrayTupleFactory<T, TMat3CtorArgs>
{
    public createOne
    (
        c1r1: number,
        c2r1: number,
        c3r1: number,
        c1r2: number,
        c2r2: number,
        c3r2: number,
        c1r3: number,
        c2r3: number,
        c3r3: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = c1r1;
        a[1] = c2r1;
        a[2] = c3r1;
        a[3] = c1r2;
        a[4] = c2r2;
        a[5] = c3r2;
        a[6] = c1r3;
        a[7] = c2r3;
        a[8] = c3r3;

        return a as T;
    }

    public createOneEmpty(): T
    {
        return new Float32Array(9) as unknown as T;
    }

    public copyFromBuffer
    (
        bufferView: DataView,
        mat2Ptr: number,
        writeTo?: T
    )
        : T
    {
        writeTo ||= this.createOneEmpty();
        writeTo[0] = bufferView.getFloat32(mat2Ptr, true);
        writeTo[1] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);
        writeTo[2] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);
        writeTo[4] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);
        writeTo[5] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);
        writeTo[6] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);
        writeTo[7] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);
        writeTo[8] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);

        return writeTo;
    }

    public copyToBuffer
    (
        bufferView: DataView,
        writeFrom: T,
        mat2Ptr: number
    )
        : void
    {
        bufferView.setFloat32(mat2Ptr, writeFrom[0], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[1], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[2], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[3], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[4], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[5], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[6], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[7], true);
        bufferView.setFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, writeFrom[8], true);
    }
}