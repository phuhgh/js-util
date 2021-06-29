import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { ATypedTupleFactory } from "../a-typed-tuple-factory";
import { TTypedArray } from "../t-typed-array";
import { Mat3, Mat3Ctor, TMat3CtorArgs } from "./mat3";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";

export class Mat3Factory<T extends Mat3<TTypedArray>>
    extends ATypedTupleFactory<T, TMat3CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat3CtorArgs>
{
    public constructor
    (
        private ctor: Mat3Ctor<TTypedArray>,
        dataView: INormalizedDataView,
    )
    {
        super(9, ctor.BYTES_PER_ELEMENT, dataView);
    }

    public createOneEmpty(): T
    {
        return new this.ctor() as T;
    }

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
}