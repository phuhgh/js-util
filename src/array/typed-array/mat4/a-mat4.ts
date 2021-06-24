import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 * Row major 4x4 matrix.
 *
 * @remarks
 * see {@link Mat4} for methods.
 */
export abstract class AMat4<TArray extends TTypedArray> extends ATypedArrayTuple<16>
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
     * c4r1
     */
    public abstract 3: number;
    /**
     * c1r2
     */
    public abstract 4: number;
    /**
     * c2r2
     */
    public abstract 5: number;
    /**
     * c3r2
     */
    public abstract 6: number;
    /**
     * c4r2
     */
    public abstract 7: number;
    /**
     * c1r3
     */
    public abstract 8: number;
    /**
     * c2r3
     */
    public abstract 9: number;
    /**
     * c3r3
     */
    public abstract 10: number;
    /**
     * c4r3
     */
    public abstract 11: number;
    /**
     * c1r4
     */
    public abstract 12: number;
    /**
     * c2r4
     */
    public abstract 13: number;
    /**
     * c3r4
     */
    public abstract 14: number;
    /**
     * c4r4
     */
    public abstract 15: number;

    protected abstract TTypeGuardMat4: true;
    protected abstract TTypeGuardTypedArray: TArray;
}

/**
 * @public
 * Float32 {@link AMat4}.
 */
export type TMat4 = AMat4<Float32Array>;