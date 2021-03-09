import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat3F32Factory } from "./mat3-f32-factory";

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
 * Float32 row major 3x3 matrix.
 */
export abstract class Mat3F32 extends ATypedArrayTuple<Mat3F32>
{
    /**
     * c1r1
     */
    public abstract 0: number;
    /**
     * c2r1
     */
    public abstract 1: number;
    /**
     * c3r1
     */
    public abstract 2: number;
    /**
     * c1r2
     */
    public abstract 3: number;
    /**
     * c2r2
     */
    public abstract 4: number;
    /**
     * c3r2
     */
    public abstract 5: number;
    /**
     * c1r3
     */
    public abstract 6: number;
    /**
     * c2r3
     */
    public abstract 7: number;
    /**
     * c3r3
     */
    public abstract 8: number;

    public static factory: ITypedArrayTupleFactory<Mat3F32, TMat3CtorArgs> = new Mat3F32Factory<Mat3F32>();

    public static createIdentityMatrix(): Mat3F32
    {
        const result = this.factory.createOneEmpty();

        result[0] = 1;
        result[4] = 1;
        result[8] = 1;

        return result;
    }

    /**
     * counter clockwise
     */
    public static createRotationMatrix(angle: number, result?: Mat3F32): Mat3F32
    {
        if (result == null)
        {
            result = this.factory.createOneEmpty();
        }

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

    public static createScalingMatrix(scalingFactorX: number, scalingFactorY: number, result?: Mat3F32): Mat3F32
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

    public static createTranslationMatrix(translationX: number, translationY: number, result?: Mat3F32): Mat3F32
    {
        if (result == null)
        {
            result = this.factory.createOneEmpty();
        }

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

    public static multiply(a: Mat3F32, b: Mat3F32, result?: Mat3F32): Mat3F32
    {
        if (result == null)
        {
            result = this.factory.createOneEmpty();
        }

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

    public static getLoggableValue(value: Mat3F32): number[][]
    {
        return [
            [value[0], value[1], value[2]],
            [value[3], value[4], value[5]],
            [value[6], value[7], value[8]],
        ];
    }

    protected abstract typeGuardMat3: true;
}