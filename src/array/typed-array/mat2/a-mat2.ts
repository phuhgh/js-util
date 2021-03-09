import { ATypedArrayTuple } from "../a-typed-array-tuple";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

/**
 * @public
 * Row major 2x2 matrix.
 *
 * @remarks
 * see {@link Mat2} for methods.
 */
export abstract class AMat2<TArray> extends ATypedArrayTuple<AMat2<TArray>>
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
export type TMat2F32 = AMat2<EArrayTypeGuard.F32>;