import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { TMat4CtorArgs } from "./mat4";
import { AF32TupleFactory } from "../a-f32-tuple-factory";
import { AMat4 } from "./a-mat4";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

export class Mat4F32Factory<T extends AMat4<EArrayTypeGuard.F32>>
    extends AF32TupleFactory<T, TMat4CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat4CtorArgs>
{
    public constructor()
    {
        super(16);
    }

    public createOne
    (
        c1r1: number,
        c2r1: number,
        c3r1: number,
        c4r1: number,
        c1r2: number,
        c2r2: number,
        c3r2: number,
        c4r2: number,
        c1r3: number,
        c2r3: number,
        c3r3: number,
        c4r3: number,
        c1r4: number,
        c2r4: number,
        c3r4: number,
        c4r4: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = c1r1;
        a[1] = c2r1;
        a[2] = c3r1;
        a[3] = c4r1;
        a[4] = c1r2;
        a[5] = c2r2;
        a[6] = c3r2;
        a[7] = c4r2;
        a[8] = c1r3;
        a[9] = c2r3;
        a[10] = c3r3;
        a[11] = c4r3;
        a[12] = c1r4;
        a[13] = c2r4;
        a[14] = c3r4;
        a[15] = c4r4;

        return a as T;
    }
}
