import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat2F32Factory } from "./mat2-f32-factory";


/**
 * @public
 */
export type TMat2CtorArgs = [c1r1: number, c2r1: number, c2r2: number, c2r2: number];

/**
 * @public
 * Float32 row major 2x2 matrix.
 */
export abstract class Mat2F32 extends ATypedArrayTuple<Mat2F32>
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
     * c2r2
     */
    public abstract 2: number;
    /**
     * c2r2
     */
    public abstract 3: number;

    public static factory: ITypedArrayTupleFactory<Mat2F32, TMat2CtorArgs> = new Mat2F32Factory<Mat2F32>();

    public static add
    (
        a: Mat2F32,
        b: Mat2F32,
        result?: Mat2F32
    )
        : Mat2F32
    {
        result ||= this.factory.createOneEmpty();
        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
        result[2] = a[2] + b[2];
        result[3] = a[3] + b[3];

        return result;
    }

    public static areEqual(a: Mat2F32, b: Mat2F32): boolean
    {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }

    public static getLoggableValue(value: Mat2F32): number[][]
    {
        return [
            [value[0], value[1]],
            [value[2], value[3]],
        ];
    }

    protected abstract typeGuardMat2: true;
}