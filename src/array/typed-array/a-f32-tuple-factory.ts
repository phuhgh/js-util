import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { ATypedTupleFactory } from "./a-typed-tuple-factory";

export abstract class AF32TupleFactory<T extends object, TCtorArgs extends number[]>
    extends ATypedTupleFactory<T, TCtorArgs>
    implements ITypedArrayTupleFactory<T, TCtorArgs>
{
    protected constructor
    (
        length: number,
    )
    {
        super(length, Float32Array);
    }

    public abstract createOne(...args: TCtorArgs): T;

    public copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            (writeTo as unknown as number[])[i] = memoryDataView.getFloat32(pointer, littleEndian);
            pointer += Float32Array.BYTES_PER_ELEMENT;
        }

        return writeTo;
    }

    public copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            memoryDataView.setFloat32(pointer, (writeFrom as unknown as number[])[i], littleEndian);
            pointer += Float32Array.BYTES_PER_ELEMENT;
        }
    }
}