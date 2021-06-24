import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 * Vector 2.
 *
 * @remarks
 * see {@link Vec2} for methods.
 */
export abstract class AVec2<TArray extends TTypedArray> extends ATypedArrayTuple<2>
{
    /**
     * x
     */
    public abstract 0: number;
    /**
     * y
     */
    public abstract 1: number;

    protected abstract TTypeGuardVec2: true;
    protected abstract TTypeGuardTypedArray: TArray;
}

/**
 * @public
 * Float32 {@link AVec2}.
 */
export type TVec2F32 = AVec2<Float32Array>;