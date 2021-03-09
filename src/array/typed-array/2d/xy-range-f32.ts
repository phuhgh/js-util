import { Mat2F32 } from "../mat2/mat2-f32";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat2F32Factory } from "../mat2/mat2-f32-factory";

/**
 * @public
 */
export type TXyRangeCtorArgs = [xMin: number, xMax: number, yMin: number, yMax: number];

/**
 * @public
 * Float32 row major 2x2 matrix representing a 2d range.
 */
export abstract class XyRangeF32 extends Mat2F32
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

    public static factory: ITypedArrayTupleFactory<XyRangeF32, TXyRangeCtorArgs> = new Mat2F32Factory<XyRangeF32>();

    public static setXMin(xyRange: XyRangeF32, value: number): void
    {
        xyRange[0] = value;
    }

    public static setXMax(xyRange: XyRangeF32, value: number): void
    {
        xyRange[1] = value;
    }

    public static setYMin(xyRange: XyRangeF32, value: number): void
    {
        xyRange[2] = value;
    }

    public static setYMax(xyRange: XyRangeF32, value: number): void
    {
        xyRange[3] = value;
    }

    public static getXMin(range: XyRangeF32): number
    {
        return range[0];
    }

    public static getXMax(range: XyRangeF32): number
    {
        return range[1];
    }

    public static getYMin(range: XyRangeF32): number
    {
        return range[2];
    }

    public static getYMax(range: XyRangeF32): number
    {
        return range[3];
    }

    public static getXRange(range: XyRangeF32): number
    {
        return range[1] - range[0];
    }

    public static getYRange(range: XyRangeF32): number
    {
        return range[3] - range[2];
    }

    public static getXCenter(range: XyRangeF32): number
    {
        return (range[0] + range[1]) * 0.5;
    }

    public static getYCenter(range: XyRangeF32): number
    {
        return (range[2] + range[3]) * 0.5;
    }

    public static getXSum(range: XyRangeF32): number
    {
        return range[0] + range[1];
    }

    public static getYSum(range: XyRangeF32): number
    {
        return range[2] + range[3];
    }

    public static unionRange
    (
        a: XyRangeF32,
        b: XyRangeF32,
        writeTo?: XyRangeF32
    )
        : XyRangeF32
    {
        writeTo ||= this.factory.createOneEmpty();

        writeTo[0] = a[0] > b[0] ? b[0] : a[0];
        writeTo[1] = a[1] < b[1] ? b[1] : a[1];
        writeTo[2] = a[2] > b[2] ? b[2] : a[2];
        writeTo[3] = a[3] < b[3] ? b[3] : a[3];

        return writeTo;
    }

    protected abstract typeGuardXyRange: true;
}
