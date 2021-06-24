import { XyRange } from "../xy-range/xy-range";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { AXyMargin, TXyMarginF32 } from "./a-xy-margin";
import { AXyRange } from "../xy-range/a-xy-range";
import { Mat2F32Factory } from "../../mat2/mat2-f32-factory";
import { TTypedArray } from "../../t-typed-array";

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
    public static f32: XyMargin<Float32Array> = new XyMargin(new Mat2F32Factory<TXyMarginF32>());

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