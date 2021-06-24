import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 * Vector 3.
 *
 * @remarks
 * see {@link Vec3} for methods.
 */
export abstract class AVec3<TArray extends TTypedArray> extends ATypedArrayTuple<3>
{
    /**
     * x
     */
    public abstract 0: number;
    /**
     * y
     */
    public abstract 1: number;
    /**
     * z
     */
    public abstract 2: number;

    protected abstract TTypeGuardVec3: true;
    protected abstract TTypeGuardTypedArray: TArray;
}

/**
 * @public
 * Float32 {@link AVec3}.
 */
export type TVec3F32 = AVec3<Float32Array>;