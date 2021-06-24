import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { AXyRange, TXyRangeF32, TXyRangeF64 } from "./a-xy-range";
import { Mat2F32Factory } from "../../mat2/mat2-f32-factory";
import { Mat2F64Factory } from "../../mat2/mat2-f64-factory";
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
    public static f32: XyRange<Float32Array> = new XyRange<Float32Array>(new Mat2F32Factory<TXyRangeF32>());
    public static f64: XyRange<Float64Array> = new XyRange<Float64Array>(new Mat2F64Factory<TXyRangeF64>());

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
