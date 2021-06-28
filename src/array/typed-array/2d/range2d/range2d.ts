import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { ARange2d } from "./a-range2d";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { TTypedArray } from "../../t-typed-array";

/**
 * @public
 */
export type TRange2dCtorArgs = [xMin: number, xMax: number, yMin: number, yMax: number];

/**
 * @public
 * Provider of typed array tuple {@link ARange2d}. See static properties for factories and instance members for utilities.
 */
export class Range2d<TArray extends TTypedArray>
{
    public static f64: Range2d<Float64Array> = new Range2d(new Mat2Factory(Float64Array));
    public static f32: Range2d<Float32Array> = new Range2d(new Mat2Factory(Float32Array));
    public static u32: Range2d<Uint32Array> = new Range2d(new Mat2Factory(Uint32Array));
    public static i32: Range2d<Int32Array> = new Range2d(new Mat2Factory(Int32Array));
    public static u16: Range2d<Uint16Array> = new Range2d(new Mat2Factory(Uint16Array));
    public static i16: Range2d<Int16Array> = new Range2d(new Mat2Factory(Int16Array));
    public static u8c: Range2d<Uint8ClampedArray> = new Range2d(new Mat2Factory(Uint8ClampedArray));
    public static u8: Range2d<Uint8Array> = new Range2d(new Mat2Factory(Uint8Array));
    public static i8: Range2d<Int8Array> = new Range2d(new Mat2Factory(Int8Array));

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<ARange2d<TArray>, TRange2dCtorArgs>,
    )
    {
    }

    public setXMin(range2d: ARange2d<TArray>, value: number): void
    {
        range2d[0] = value;
    }

    public setXMax(range2d: ARange2d<TArray>, value: number): void
    {
        range2d[1] = value;
    }

    public setYMin(range2d: ARange2d<TArray>, value: number): void
    {
        range2d[2] = value;
    }

    public setYMax(range2d: ARange2d<TArray>, value: number): void
    {
        range2d[3] = value;
    }

    public getXMin(range: Readonly<ARange2d<TArray>>): number
    {
        return range[0];
    }

    public getXMax(range: Readonly<ARange2d<TArray>>): number
    {
        return range[1];
    }

    public getYMin(range: Readonly<ARange2d<TArray>>): number
    {
        return range[2];
    }

    public getYMax(range: Readonly<ARange2d<TArray>>): number
    {
        return range[3];
    }

    public getXRange(range: Readonly<ARange2d<TArray>>): number
    {
        return range[1] - range[0];
    }

    public getYRange(range: Readonly<ARange2d<TArray>>): number
    {
        return range[3] - range[2];
    }

    public getXCenter(range: Readonly<ARange2d<TArray>>): number
    {
        return (range[0] + range[1]) * 0.5;
    }

    public getYCenter(range: Readonly<ARange2d<TArray>>): number
    {
        return (range[2] + range[3]) * 0.5;
    }

    public getXSum(range: Readonly<ARange2d<TArray>>): number
    {
        return range[0] + range[1];
    }

    public getYSum(range: Readonly<ARange2d<TArray>>): number
    {
        return range[2] + range[3];
    }

    public unionRange
    (
        a: Readonly<ARange2d<TArray>>,
        b: Readonly<ARange2d<TArray>>,
        writeTo: ARange2d<TArray> = this.factory.createOneEmpty(),
    )
        : ARange2d<TArray>
    {
        writeTo[0] = a[0] > b[0] ? b[0] : a[0];
        writeTo[1] = a[1] < b[1] ? b[1] : a[1];
        writeTo[2] = a[2] > b[2] ? b[2] : a[2];
        writeTo[3] = a[3] < b[3] ? b[3] : a[3];

        return writeTo;
    }
}
