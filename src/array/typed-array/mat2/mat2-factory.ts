import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AMat2 } from "./a-mat2";
import { TMat2CtorArgs } from "./mat2";
import { ATypedTupleFactory } from "../a-typed-tuple-factory";
import { TTypedArrayCtor } from "../t-typed-array-ctor";

export class Mat2Factory<T extends AMat2<InstanceType<TCtor>>, TCtor extends TTypedArrayCtor>
    extends ATypedTupleFactory<T, TMat2CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat2CtorArgs>
{
    public constructor
    (
        ctor: TCtor,
    )
    {
        super(4, ctor);
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
        writeTo[0] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
        writeTo[1] = this.dataView.getValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[2] = this.dataView.getValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, littleEndian);
        writeTo[3] = this.dataView.getValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, littleEndian);

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
        this.dataView.setValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, writeFrom[1], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, writeFrom[2], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += Float64Array.BYTES_PER_ELEMENT, writeFrom[3], littleEndian);
    }
}