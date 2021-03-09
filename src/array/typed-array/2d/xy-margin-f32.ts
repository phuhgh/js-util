import { XyRangeF32 } from "./xy-range-f32";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat2F32Factory } from "../mat2/mat2-f32-factory";

/**
 * @public
 */
export type TXyMarginCtorArgs = [left: number, right: number, top: number, bottom: number];

/**
 * @public
 * Float32 row major 2x2 matrix representing margins on a rectangle.
 */
export abstract class XyMarginF32 extends XyRangeF32
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

    public static factory: ITypedArrayTupleFactory<XyMarginF32, TXyMarginCtorArgs> = new Mat2F32Factory<XyMarginF32>();

    public static getLeft(position: XyMarginF32): number
    {
        return position[0];
    }

    public static getRight(position: XyMarginF32): number
    {
        return position[1];
    }

    public static getTop(position: XyMarginF32): number
    {
        return position[2];
    }

    public static getBottom(position: XyMarginF32): number
    {
        return position[3];
    }

    public static sumX(position: XyMarginF32): number
    {
        return position[0] + position[1];
    }

    public static sumY(position: XyMarginF32): number
    {
        return position[2] + position[3];
    }

    protected abstract typeAXyPositionPosition: true;
}