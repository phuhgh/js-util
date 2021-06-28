import { ARange2d } from "../range2d/a-range2d";
import { TTypedArray } from "../../t-typed-array";

/**
 * @public
 * Row major 2x2 matrix representing margins on a rectangle.
 *
 * @remarks
 * See {@link Margin2d} for methods.
 */
export abstract class AMargin2d<TArray extends TTypedArray> extends ARange2d<TArray>
{
    /**
     * left
     */
    public abstract 0: number;
    /**
     * right
     */
    public abstract 1: number;
    /**
     * top
     */
    public abstract 2: number;
    /**
     * bottom
     */
    public abstract 3: number;

    protected abstract TTypeGuardAMargin2d: true;
}

/**
 * @public
 * A float32 {@link AMargin2d}.
 */
export type TF32Margin2d = AMargin2d<Float32Array>;