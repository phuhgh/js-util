import { XyRange } from "../xy-range/xy-range";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { AXyMargin } from "./a-xy-margin";
import { AXyRange } from "../xy-range/a-xy-range";
import { TTypedArray } from "../../t-typed-array";
import { Mat2Factory } from "../../mat2/mat2-factory";

/**
 * @public
 */
export type TXyMarginCtorArgs = [left: number, right: number, top: number, bottom: number];

/**
 * @public
 * Provider of typed array tuple {@link AXyMargin}. See static properties for factories and instance members for utilities.
 */
export class XyMargin<TArray extends TTypedArray> extends XyRange<TArray>
{
    public static f64: XyMargin<Float64Array> = new XyMargin(new Mat2Factory(Float64Array));
    public static f32: XyMargin<Float32Array> = new XyMargin(new Mat2Factory(Float32Array));
    public static u32: XyMargin<Uint32Array> = new XyMargin(new Mat2Factory(Uint32Array));
    public static i32: XyMargin<Int32Array> = new XyMargin(new Mat2Factory(Int32Array));
    public static u16: XyMargin<Uint16Array> = new XyMargin(new Mat2Factory(Uint16Array));
    public static i16: XyMargin<Int16Array> = new XyMargin(new Mat2Factory(Int16Array));
    public static u8c: XyMargin<Uint8ClampedArray> = new XyMargin(new Mat2Factory(Uint8ClampedArray));
    public static u8: XyMargin<Uint8Array> = new XyMargin(new Mat2Factory(Uint8Array));
    public static i8: XyMargin<Int8Array> = new XyMargin(new Mat2Factory(Int8Array));

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AXyMargin<TArray>, TXyMarginCtorArgs>,
    )
    {
        super(factory);
    }

    public getLeft(position: Readonly<AXyMargin<TArray>>): number
    {
        return position[0];
    }

    public getRight(position: Readonly<AXyMargin<TArray>>): number
    {
        return position[1];
    }

    public getTop(position: Readonly<AXyMargin<TArray>>): number
    {
        return position[2];
    }

    public getBottom(position: Readonly<AXyMargin<TArray>>): number
    {
        return position[3];
    }

    public sumX(position: Readonly<AXyMargin<TArray>>): number
    {
        return position[0] + position[1];
    }

    public sumY(position: Readonly<AXyMargin<TArray>>): number
    {
        return position[2] + position[3];
    }

    public getInnerRange
    (
        range: Readonly<AXyRange<TArray>>,
        margins: Readonly<AXyMargin<TArray>>,
        result: AXyRange<TArray> = this.factory.createOneEmpty(),
    )
        : AXyRange<TArray>
    {
        result[0] = range[0] + margins[0];
        result[1] = range[1] - margins[1];
        result[2] = range[2] + margins[2];
        result[3] = range[3] - margins[3];

        return result;
    }
}