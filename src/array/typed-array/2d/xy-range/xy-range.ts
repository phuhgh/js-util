import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { AXyRange } from "./a-xy-range";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { TTypedArray } from "../../t-typed-array";

/**
 * @public
 */
export type TXyRangeCtorArgs = [xMin: number, xMax: number, yMin: number, yMax: number];

/**
 * @public
 * Provider of typed array tuple {@link AXyRange}. See static properties for factories and instance members for utilities.
 */
export class XyRange<TArray extends TTypedArray>
{
    public static f64: XyRange<Float64Array> = new XyRange(new Mat2Factory(Float64Array));
    public static f32: XyRange<Float32Array> = new XyRange(new Mat2Factory(Float32Array));
    public static u32: XyRange<Uint32Array> = new XyRange(new Mat2Factory(Uint32Array));
    public static i32: XyRange<Int32Array> = new XyRange(new Mat2Factory(Int32Array));
    public static u16: XyRange<Uint16Array> = new XyRange(new Mat2Factory(Uint16Array));
    public static i16: XyRange<Int16Array> = new XyRange(new Mat2Factory(Int16Array));
    public static u8c: XyRange<Uint8ClampedArray> = new XyRange(new Mat2Factory(Uint8ClampedArray));
    public static u8: XyRange<Uint8Array> = new XyRange(new Mat2Factory(Uint8Array));
    public static i8: XyRange<Int8Array> = new XyRange(new Mat2Factory(Int8Array));

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AXyRange<TArray>, TXyRangeCtorArgs>,
    )
    {
    }

    public setXMin(xyRange: AXyRange<TArray>, value: number): void
    {
        xyRange[0] = value;
    }

    public setXMax(xyRange: AXyRange<TArray>, value: number): void
    {
        xyRange[1] = value;
    }

    public setYMin(xyRange: AXyRange<TArray>, value: number): void
    {
        xyRange[2] = value;
    }

    public setYMax(xyRange: AXyRange<TArray>, value: number): void
    {
        xyRange[3] = value;
    }

    public getXMin(range: Readonly<AXyRange<TArray>>): number
    {
        return range[0];
    }

    public getXMax(range: Readonly<AXyRange<TArray>>): number
    {
        return range[1];
    }

    public getYMin(range: Readonly<AXyRange<TArray>>): number
    {
        return range[2];
    }

    public getYMax(range: Readonly<AXyRange<TArray>>): number
    {
        return range[3];
    }

    public getXRange(range: Readonly<AXyRange<TArray>>): number
    {
        return range[1] - range[0];
    }

    public getYRange(range: Readonly<AXyRange<TArray>>): number
    {
        return range[3] - range[2];
    }

    public getXCenter(range: Readonly<AXyRange<TArray>>): number
    {
        return (range[0] + range[1]) * 0.5;
    }

    public getYCenter(range: Readonly<AXyRange<TArray>>): number
    {
        return (range[2] + range[3]) * 0.5;
    }

    public getXSum(range: Readonly<AXyRange<TArray>>): number
    {
        return range[0] + range[1];
    }

    public getYSum(range: Readonly<AXyRange<TArray>>): number
    {
        return range[2] + range[3];
    }

    public unionRange
    (
        a: Readonly<AXyRange<TArray>>,
        b: Readonly<AXyRange<TArray>>,
        writeTo: AXyRange<TArray> = this.factory.createOneEmpty(),
    )
        : AXyRange<TArray>
    {
        writeTo[0] = a[0] > b[0] ? b[0] : a[0];
        writeTo[1] = a[1] < b[1] ? b[1] : a[1];
        writeTo[2] = a[2] > b[2] ? b[2] : a[2];
        writeTo[3] = a[3] < b[3] ? b[3] : a[3];

        return writeTo;
    }
}
