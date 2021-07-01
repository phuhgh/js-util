import { TTypedArray } from "../../t-typed-array";
import { ITypedArrayCtor } from "../../i-typed-array-ctor";
import { Mat2 } from "../../mat2/mat2";
import { INormalizedDataView } from "../../normalized-data-view/i-normalized-data-view";
import { Range2d, Range2dCtor, TRange2dCtorArgs } from "./range2d";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { getMat2Ctor } from "../../mat2/get-mat2-ctor";
import { Vec2 } from "../../vec2/vec2";

/**
 * @internal
 */
export function getRange2dCtor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Mat2<TArray>>, dataView: INormalizedDataView): Range2dCtor<TArray>
{
    return class Range2dImpl extends getMat2Ctor(ctor, dataView) implements Range2d<TArray>
    {
        public static factory: ITypedArrayTupleFactory<Range2d<TArray>, TRange2dCtorArgs> = new Mat2Factory(Range2dImpl, dataView);

        public setXMin(value: number): void
        {
            this[0] = value;
        }

        public setXMax(value: number): void
        {
            this[1] = value;
        }

        public setYMin(value: number): void
        {
            this[2] = value;
        }

        public setYMax(value: number): void
        {
            this[3] = value;
        }

        public getXMin(): number
        {
            return this[0];
        }

        public getXMax(): number
        {
            return this[1];
        }

        public getYMin(): number
        {
            return this[2];
        }

        public getYMax(): number
        {
            return this[3];
        }

        public getXRange(): number
        {
            return this[1] - this[0];
        }

        public getYRange(): number
        {
            return this[3] - this[2];
        }

        public getXCenter(): number
        {
            return (this[0] + this[1]) * 0.5;
        }

        public getYCenter(): number
        {
            return (this[2] + this[3]) * 0.5;
        }

        public getXSum(): number
        {
            return this[0] + this[1];
        }

        public getYSum(): number
        {
            return this[2] + this[3];
        }

        public unionRange
        (
            range: Readonly<Range2d<TArray>>,
            writeTo: Range2d<TArray> = (this.constructor as Range2dCtor<TArray>).factory.createOneEmpty(),
        )
            : Range2d<TArray>
        {
            writeTo[0] = this[0] > range[0] ? range[0] : this[0];
            writeTo[1] = this[1] < range[1] ? range[1] : this[1];
            writeTo[2] = this[2] > range[2] ? range[2] : this[2];
            writeTo[3] = this[3] < range[3] ? range[3] : this[3];

            return writeTo;
        }

        public isPointInRange(point: Vec2<TArray>): boolean
        {
            const x = point.getX();
            const y = point.getY();
            return x >= this.getXMin() && x <= this.getXMax() && y >= this.getYMin() && y <= this.getYMax();
        }

        public TTypeGuardRange2d!: true;
    } as Range2dCtor<TArray>;
}