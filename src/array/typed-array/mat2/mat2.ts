import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AMat2, TMat2F32, TMat2F64 } from "./a-mat2";
import type { EArrayTypeGuard } from "../e-typed-array-guard";
import { Mat2F32Factory } from "./mat2-f32-factory";
import { _Debug } from "../../../debug/_debug";
import { Mat2F64Factory } from "./mat2-f64-factory";

/**
 * @public
 */
export type TMat2CtorArgs = [c1r1: number, c2r1: number, c2r2: number, c2r2: number];

/**
 * @public
 * Provider of typed array tuple {@link AMat2}. See static properties for factories and instance members for utilities.
 */
export class Mat2<TArray extends EArrayTypeGuard>
{
    public static f32: Mat2<EArrayTypeGuard.F32> = new Mat2<EArrayTypeGuard.F32>(new Mat2F32Factory<TMat2F32>());
    public static f64: Mat2<EArrayTypeGuard.F64> = new Mat2<EArrayTypeGuard.F64>(new Mat2F64Factory<TMat2F64>());

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AMat2<TArray>, TMat2CtorArgs>,
    )
    {
    }

    public createIdentityMatrix(): AMat2<TArray>
    {
        const result = this.factory.createOneEmpty();

        result[0] = 1;
        result[3] = 1;

        return result;
    }

    public getIndex(column: number, row: number): Extract<keyof Mat2<never>, number>
    {
        DEBUG_MODE && _Debug.assert(column >= 0 && column < 2 && row >= 0 && row < 2, "out of bounds");
        return row * 2 + column as Extract<keyof Mat2<never>, number> ;
    }

    public getLoggableValue(value: Readonly<AMat2<TArray>>): number[][]
    {
        return [
            [value[0], value[1]],
            [value[2], value[3]],
        ];
    }
}

