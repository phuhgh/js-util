import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 * Row major 3x3 matrix.
 *
 * @remarks
 * see {@link Mat3} for methods.
 */
export abstract class AMat3<TArray extends TTypedArray> extends ATypedArrayTuple<9>
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

    protected abstract TTypeGuardMat3: true;
    protected abstract TTypeGuardTypedArray: TArray;
}

/**
 * @public
 * Float32 {@link AMat3}.
 */
export type TMat3F32 = AMat3<Float32Array>;
