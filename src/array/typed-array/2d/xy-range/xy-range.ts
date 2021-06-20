import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { AXyRange, TXyRangeF32 } from "./a-xy-range";
import type { EArrayTypeGuard } from "../../e-typed-array-guard";
import { Mat2F32Factory } from "../../mat2/mat2-f32-factory";

/**
 * @public
 */
export type TXyRangeCtorArgs = [xMin: number, xMax: number, yMin: number, yMax: number];

/**
 * @public
 * Provider of typed array tuple {@link AXyRange}. See static properties for factories and instance members for utilities.
 */
export class XyRange<TArray extends EArrayTypeGuard>
{
    public static f32: XyRange<EArrayTypeGuard.F32> = new XyRange<EArrayTypeGuard.F32>(new Mat2F32Factory<TXyRangeF32>());

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

    public getXMin(range: AXyRange<TArray>): number
    {
        return range[0];
    }

    public getXMax(range: AXyRange<TArray>): number
    {
        return range[1];
    }

    public getYMin(range: AXyRange<TArray>): number
    {
        return range[2];
    }

    public getYMax(range: AXyRange<TArray>): number
    {
        return range[3];
    }

    public getXRange(range: AXyRange<TArray>): number
    {
        return range[1] - range[0];
    }

    public getYRange(range: AXyRange<TArray>): number
    {
        return range[3] - range[2];
    }

    public getXCenter(range: AXyRange<TArray>): number
    {
        return (range[0] + range[1]) * 0.5;
    }

    public getYCenter(range: AXyRange<TArray>): number
    {
        return (range[2] + range[3]) * 0.5;
    }

    public getXSum(range: AXyRange<TArray>): number
    {
        return range[0] + range[1];
    }

    public getYSum(range: AXyRange<TArray>): number
    {
        return range[2] + range[3];
    }

    public unionRange
    (
        a: AXyRange<TArray>,
        b: AXyRange<TArray>,
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
