import { AMat2 } from "../../mat2/a-mat2";
import { TTypedArray } from "../../t-typed-array";

/**
 * @public
 * Row major 2x2 matrix representing a 2d range.
 *
 * @remarks
 * See {@link Range2d} for methods.
 */
export abstract class ARange2d<TArray extends TTypedArray> extends AMat2<TArray>
{
    /**
     * xMin
     */
    public abstract 0: number;
    /**
     * xMax
     */
    public abstract 1: number;
    /**
     * yMin
     */
    public abstract 2: number;
    /**
     * yMax
     */
    public abstract 3: number;

    protected abstract TTypeGuardRange2d: true;
}

/**
 * @public
 * A float32 {@link ARange2d}.
 */
export type TF32Range2d = ARange2d<Float32Array>;
export type TF64Range2d = ARange2d<Float64Array>;