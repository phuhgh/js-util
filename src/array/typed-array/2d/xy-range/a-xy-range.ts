import { AMat2 } from "../../mat2/a-mat2";
import { TTypedArray } from "../../t-typed-array";

/**
 * @public
 * Row major 2x2 matrix representing a 2d range.
 *
 * @remarks
 * See {@link XyRange} for methods.
 */
export abstract class AXyRange<TArray extends TTypedArray> extends AMat2<TArray>
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

    protected abstract TTypeGuardXyRange: true;
}

/**
 * @public
 * A float32 {@link AXyRange}.
 */
export type TXyRangeF32 = AXyRange<Float32Array>;
export type TXyRangeF64 = AXyRange<Float64Array>;