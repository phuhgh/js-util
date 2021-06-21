import { ATypedArrayTuple } from "../a-typed-array-tuple";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

/**
 * @public
 * Vector 3.
 *
 * @remarks
 * see {@link Vec3} for methods.
 */
export abstract class AVec3<TArray extends EArrayTypeGuard> extends ATypedArrayTuple<3>
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
export type TVec3F32 = AVec3<EArrayTypeGuard.F32>;