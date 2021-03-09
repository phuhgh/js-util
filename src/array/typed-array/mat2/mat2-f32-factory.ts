import { Mat2F32, TMat2CtorArgs } from "./mat2-f32";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";

// extracted to allow for future extension, webgl only supports float32 matrices so no point right now
export class Mat2F32Factory<T extends Mat2F32>
    implements ITypedArrayTupleFactory<T, TMat2CtorArgs>
{
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

    public createOneEmpty(): T
    {
        return new Float32Array(4) as unknown as T;
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
        writeTo[3] = bufferView.getFloat32(mat2Ptr += Float32Array.BYTES_PER_ELEMENT, true);

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
    }
}