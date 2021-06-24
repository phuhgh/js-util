import { AXyRange } from "../xy-range/a-xy-range";
import { TTypedArray } from "../../t-typed-array";

/**
 * @public
 * Row major 2x2 matrix representing margins on a rectangle.
 *
 * @remarks
 * See {@link XyMargin} for methods.
 */
export abstract class AXyMargin<TArray extends TTypedArray> extends AXyRange<TArray>
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

    protected abstract TTypeGuardAXyPositionPosition: true;
}

/**
 * @public
 * A float32 {@link AXyMargin}.
 */
export type TXyMarginF32 = AXyMargin<Float32Array>;