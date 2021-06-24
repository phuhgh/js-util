import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 * Row major 2x2 matrix.
 *
 * @remarks
 * see {@link Mat2} for methods.
 */
export abstract class AMat2<TArray extends TTypedArray> extends ATypedArrayTuple<4>
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

    protected abstract TTypeGuardMat2: true;
    protected abstract TTypeGuardTypedArray: TArray;
}

/**
 * @public
 * Float32 {@link AMat2}.
 */
export type TMat2F32 = AMat2<Float32Array>;
export type TMat2F64 = AMat2<Float64Array>;