import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import { AMat2 } from "./a-mat2";
import { TMat2CtorArgs } from "./mat2";

export class Mat2F32Factory<T extends AMat2<Float32Array>>
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