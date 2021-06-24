import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { TMat3CtorArgs } from "./mat3";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import { AMat3 } from "./a-mat3";

export class Mat3F32Factory<T extends AMat3<Float32Array>>
    extends AF32TupleFactory<T, TMat3CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat3CtorArgs>
{
    public constructor()
    {
        super(9);
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