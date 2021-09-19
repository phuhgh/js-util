import { IRange1dCtor, Range1d, TRange1dCtorArgs } from "./range1d";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider";
import { _Debug } from "../../../../debug/_debug";
import { TTypedArray } from "../../t-typed-array";
import { getVec2Ctor } from "../get-vec2-ctor";
import { Vec2Factory } from "../vec2-factory";
import { Mat2 } from "../../mat2/mat2";

/**
 * @internal
 */
export function getRange1dCtor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : IRange1dCtor<InstanceType<TCtor>>
{
    return class Range1dImpl
        extends getVec2Ctor(ctor)
        implements Range1d<InstanceType<TCtor>>
    {
        public static factory: ITypedArrayTupleFactory<Range1d<InstanceType<TCtor>>, TRange1dCtorArgs> = new Vec2Factory(Range1dImpl, NormalizedDataViewProvider.getView(ctor));
        protected static mat2Ctor = Mat2.getCtor(ctor);

        public ["constructor"]: typeof Range1dImpl;

        public setMin(value: number): void
        {
            this[0] = value;
        }

        public setMax(value: number): void
        {
            this[1] = value;
        }

        public getMin(): number
        {
            return this[0];
        }

        public getMax(): number
        {
            return this[1];
        }

        public getRange(): number
        {
            return this[1] - this[0];
        }

        public getCenter(): number
        {
            return (this[0] + this[1]) * 0.5;
        }

        public mat2Multiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: Readonly<Mat2<TTypedArray>>,
            writeTo: Range1d<TResult> = this.constructor.factory.createOneEmpty() as Range1d<TResult>,
        )
            : Range1d<TResult>
        {
            writeTo.setMin(mat.getVec2MultiplyX(this.getMin()));
            writeTo.setMax(mat.getVec2MultiplyX(this.getMax()));

            return writeTo;
        }

        public unionRange<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            range: Readonly<Range1d<TTypedArray>>,
            writeTo: Range1d<TResult> = this.constructor.factory.createOneEmpty() as Range1d<TResult>,
        )
            : Range1d<TResult>
        {
            writeTo[0] = this[0] > range[0] ? range[0] : this[0];
            writeTo[1] = this[1] < range[1] ? range[1] : this[1];

            return writeTo;
        }

        public extendRange<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: number,
            writeTo: Range1d<TResult> = this.constructor.factory.createOneEmpty() as Range1d<TResult>,
        )
            : Range1d<TResult>
        {
            writeTo[0] = this[0] > value ? value : this[0];
            writeTo[1] = this[1] < value ? value : this[1];

            return writeTo;
        }

        public getRangeTransform<TArray extends TTypedArray = InstanceType<TCtor>>
        (
            toRange: Readonly<Range1d<TTypedArray>>,
            result: Mat2<TArray> = this.constructor.mat2Ctor.factory.createOneEmpty() as Mat2<TArray>,
        )
            : Mat2<TArray>
        {
            DEBUG_MODE && _Debug.assert(this.getRange() !== 0, "divide by 0");

            const sf = toRange.getRange() / this.getRange();

            result[0] = sf;
            result[1] = 0;
            result[2] = toRange.getMin() - this.getMin() * sf;
            result[3] = 1;

            return result;
        }

        public isValueInRange1d(value: number): boolean
        {
            return value >= this.getMin() && value <= this.getMax();
        }

        public scaleRelativeTo<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            scalingFactor: number,
            relativeTo: number,
            result: Range1d<TResult> = this.constructor.factory.createOneEmpty() as Range1d<TResult>,
        )
            : Range1d<TResult>
        {
            DEBUG_MODE && _Debug.assert(this.isValueInRange1d(relativeTo), "relativeTo must be inside the range");

            let difference = this.getCenter() - relativeTo;

            // multiply by 2 as we want to compare to half the range
            // make the difference relative, varies from -1 to 1
            difference = 2 * difference / this.getRange();
            const newRange = this.getRange() * scalingFactor;
            const halfDiff = 0.5 * (this.getRange() - newRange);
            const newMin = this.getMin() + halfDiff - halfDiff * difference;
            result.setMin(newMin);
            result.setMax(newMin + newRange);

            return result;
        }

        public bound1d(boundTo: Range1d<TTypedArray>): void
        {
            if (this.getRange() > boundTo.getRange())
            {
                this.setMin(boundTo.getMin());
                this.setMax(boundTo.getMax());
            }
            else if (this.getMax() > boundTo.getMax())
            {
                const range = this.getRange();
                this.setMax(boundTo.getMax());
                this.setMin(boundTo.getMax() - range);
            }
            else if (this.getMin() < boundTo.getMin())
            {
                const range = this.getRange();
                this.setMin(boundTo.getMin());
                this.setMax(boundTo.getMin() + range);
            }
        }

        public translate1d(dv: number): void
        {
            this.setMin(this.getMin() + dv);
            this.setMax(this.getMax() + dv);
        }

        public TTypeGuardRange1d!: true;
    } as IRange1dCtor<InstanceType<TCtor>>;
}