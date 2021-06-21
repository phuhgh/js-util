import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AMat3, TMat3F32 } from "./a-mat3";
import type { EArrayTypeGuard } from "../e-typed-array-guard";
import { Mat3F32Factory } from "./mat3-f32-factory";
import { _Debug } from "../../../debug/_debug";

/**
 * @public
 */
export type TMat3CtorArgs = [
    c1r1: number,
    c2r1: number,
    c3r1: number,
    c1r2: number,
    c2r2: number,
    c3r2: number,
    c1r3: number,
    c2r3: number,
    c3r3: number,
]

/**
 * @public
 * Provider of typed array tuple {@link AMat3}. See static properties for factories and instance members for utilities.
 */
export class Mat3<TArray extends EArrayTypeGuard>
{
    public static f32: Mat3<EArrayTypeGuard.F32> = new Mat3<EArrayTypeGuard.F32>(new Mat3F32Factory<TMat3F32>());

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AMat3<TArray>, TMat3CtorArgs>,
    )
    {
    }

    public createIdentityMatrix(): AMat3<TArray>
    {
        const result = this.factory.createOneEmpty();

        result[0] = 1;
        result[4] = 1;
        result[8] = 1;

        return result;
    }

    public getIndex(column: number, row: number): Extract<keyof AMat3<never>, number>
    {
        DEBUG_MODE && _Debug.assert(column >= 0 && column < 3 && row >= 0 && row < 3, "out of bounds");
        return row * 3 + column as Extract<keyof AMat3<never>, number> ;
    }

    /**
     * counter clockwise
     */
    public createRotationMatrix
    (
        angle: number,
        result: AMat3<TArray> = this.factory.createOneEmpty()
    )
        : AMat3<TArray>
    {
        const sine = Math.sin(angle);
        const cosine = Math.cos(angle);

        result[0] = cosine;
        result[1] = -sine;
        result[2] = 0;
        result[3] = sine;
        result[4] = cosine;
        result[5] = 0;
        result[6] = 0;
        result[7] = 0;
        result[8] = 1;

        return result;
    }

    public createScalingMatrix(scalingFactorX: number, scalingFactorY: number, result?: AMat3<TArray>): AMat3<TArray>
    {
        if (result == null)
        {
            result = this.factory.createOneEmpty();
        }

        result[0] = scalingFactorX;
        result[1] = 0;
        result[2] = 0;
        result[3] = 0;
        result[4] = scalingFactorY;
        result[5] = 0;
        result[6] = 0;
        result[7] = 0;
        result[8] = 1;

        return result;
    }

    public createTranslationMatrix
    (
        translationX: number,
        translationY: number,
        result: AMat3<TArray> = this.factory.createOneEmpty(),
    )
        : AMat3<TArray>
    {
        result[0] = 1;
        result[1] = 0;
        result[2] = 0;
        result[3] = 0;
        result[4] = 1;
        result[5] = 0;
        result[6] = translationX;
        result[7] = translationY;
        result[8] = 1;

        return result;
    }

    public multiplyMat3
    (
        a: Readonly<AMat3<TArray>>,
        b: Readonly<AMat3<TArray>>,
        result: AMat3<TArray> = this.factory.createOneEmpty(),
    )
        : AMat3<TArray>
    {
        const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = a as unknown as number[];
        const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = b as unknown as number[];

        result[0] = a0 * b0 + a1 * b3 + a2 * b6;
        result[1] = a0 * b1 + a1 * b4 + a2 * b7;
        result[2] = a0 * b2 + a1 * b5 + a2 * b8;
        result[3] = a3 * b0 + a4 * b3 + a5 * b6;
        result[4] = a3 * b1 + a4 * b4 + a5 * b7;
        result[5] = a3 * b2 + a4 * b5 + a5 * b8;
        result[6] = a6 * b0 + a7 * b3 + a8 * b6;
        result[7] = a6 * b1 + a7 * b4 + a8 * b7;
        result[8] = a6 * b2 + a7 * b5 + a8 * b8;

        return result;
    }

    public getLoggableValue(value: Readonly<AMat3<TArray>>): number[][]
    {
        return [
            [value[0], value[1], value[2]],
            [value[3], value[4], value[5]],
            [value[6], value[7], value[8]],
        ];
    }
}