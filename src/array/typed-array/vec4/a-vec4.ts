import { ATypedArrayTuple } from "../a-typed-array-tuple";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

/**
 * @public
 * Vector 4.
 *
 * @remarks
 * see {@link Vec4} for methods.
 */
export abstract class AVec4<TArray extends EArrayTypeGuard> extends ATypedArrayTuple<AVec4<TArray>>
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
    /**
     * w
     */
    public abstract 3: number;

    protected abstract TTypeGuardVec4: true;
    protected abstract TTypeGuardTypedArray: TArray;
}

/**
 * @public
 * Float32 {@link AVec4}.
 */
export type TVec4F32 = AVec4<EArrayTypeGuard.F32>;

