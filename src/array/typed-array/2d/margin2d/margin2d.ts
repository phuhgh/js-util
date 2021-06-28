import { Range2d } from "../range2d/range2d";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { AMargin2d } from "./a-margin2d";
import { ARange2d } from "../range2d/a-range2d";
import { TTypedArray } from "../../t-typed-array";
import { Mat2Factory } from "../../mat2/mat2-factory";

/**
 * @public
 */
export type TMargin2dCtorArgs = [left: number, right: number, top: number, bottom: number];

/**
 * @public
 * Provider of typed array tuple {@link AMargin2d}. See static properties for factories and instance members for utilities.
 */
export class Margin2d<TArray extends TTypedArray> extends Range2d<TArray>
{
    public static f64: Margin2d<Float64Array> = new Margin2d(new Mat2Factory(Float64Array));
    public static f32: Margin2d<Float32Array> = new Margin2d(new Mat2Factory(Float32Array));
    public static u32: Margin2d<Uint32Array> = new Margin2d(new Mat2Factory(Uint32Array));
    public static i32: Margin2d<Int32Array> = new Margin2d(new Mat2Factory(Int32Array));
    public static u16: Margin2d<Uint16Array> = new Margin2d(new Mat2Factory(Uint16Array));
    public static i16: Margin2d<Int16Array> = new Margin2d(new Mat2Factory(Int16Array));
    public static u8c: Margin2d<Uint8ClampedArray> = new Margin2d(new Mat2Factory(Uint8ClampedArray));
    public static u8: Margin2d<Uint8Array> = new Margin2d(new Mat2Factory(Uint8Array));
    public static i8: Margin2d<Int8Array> = new Margin2d(new Mat2Factory(Int8Array));

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AMargin2d<TArray>, TMargin2dCtorArgs>,
    )
    {
        super(factory);
    }

    public getLeft(position: Readonly<AMargin2d<TArray>>): number
    {
        return position[0];
    }

    public getRight(position: Readonly<AMargin2d<TArray>>): number
    {
        return position[1];
    }

    public getTop(position: Readonly<AMargin2d<TArray>>): number
    {
        return position[2];
    }

    public getBottom(position: Readonly<AMargin2d<TArray>>): number
    {
        return position[3];
    }

    public sumX(position: Readonly<AMargin2d<TArray>>): number
    {
        return position[0] + position[1];
    }

    public sumY(position: Readonly<AMargin2d<TArray>>): number
    {
        return position[2] + position[3];
    }

    public getInnerRange
    (
        range: Readonly<ARange2d<TArray>>,
        margins: Readonly<AMargin2d<TArray>>,
        result: ARange2d<TArray> = this.factory.createOneEmpty(),
    )
        : ARange2d<TArray>
    {
        result[0] = range[0] + margins[0];
        result[1] = range[1] - margins[1];
        result[2] = range[2] + margins[2];
        result[3] = range[3] - margins[3];

        return result;
    }
}