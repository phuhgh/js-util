import { IRange2dCtor, IReadonlyRange2d, Range2d, TRange2dCtorArgs } from "./range2d.js";
import { getMat2Ctor } from "../../mat2/get-mat2-ctor.js";
import { IReadonlyVec2, Vec2 } from "../../vec2/vec2.js";
import { TTypedArrayCtor } from "../../t-typed-array-ctor.js";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory.js";
import { Mat2Factory } from "../../mat2/mat2-factory.js";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider.js";
import { _Debug } from "../../../../debug/_debug.js";
import { IReadonlyMat3, Mat3 } from "../../mat3/mat3.js";
import { TTypedArray } from "../../t-typed-array.js";

/**
 * @internal
 */
export function getRange2dCtor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : IRange2dCtor<InstanceType<TCtor>>
{
    return class Range2dImpl extends getMat2Ctor(ctor) implements Range2d<InstanceType<TCtor>>
    {
        public static factory: ITypedArrayTupleFactory<Range2d<InstanceType<TCtor>>, TRange2dCtorArgs> = new Mat2Factory(Range2dImpl, NormalizedDataViewProvider.getView(ctor));
        protected static vec2Ctor = Vec2.getCtor(ctor);
        protected static mat3Ctor = Mat3.getCtor(ctor);

        public ["constructor"]!: typeof Range2dImpl;

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

        public getRange<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            result: Vec2<TResult> = this.constructor.vec2Ctor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result.setX(this.getXRange());
            result.setY(this.getYRange());

            return result;
        }

        public getXRange(): number
        {
            return this[1] - this[0];
        }

        public getYRange(): number
        {
            return this[3] - this[2];
        }

        public getXMaxAbs(): number
        {
            const xMinAbs = Math.abs(this.getXMin());
            const xMaxAbs = Math.abs(this.getXMax());

            return xMinAbs > xMaxAbs ? xMinAbs : xMaxAbs;
        }

        public getYMaxAbs(): number
        {
            const yMinAbs = Math.abs(this.getYMin());
            const yMaxAbs = Math.abs(this.getYMax());

            return yMinAbs > yMaxAbs ? yMinAbs : yMaxAbs;
        }

        public getCenter<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            result: Vec2<TResult> = this.constructor.vec2Ctor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result.setX(this.getXCenter());
            result.setY(this.getYCenter());

            return result;
        }

        public getXCenter(): number
        {
            return (this[0] + this[1]) * 0.5;
        }

        public getYCenter(): number
        {
            return (this[2] + this[3]) * 0.5;
        }

        public mat3Multiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: IReadonlyMat3<TTypedArray>,
            writeTo: Range2d<TResult> = this.constructor.factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            writeTo.setXMin(mat.getVec3MultiplyX(this.getXMin()));
            writeTo.setXMax(mat.getVec3MultiplyX(this.getXMax()));
            writeTo.setYMin(mat.getVec3MultiplyY(this.getYMin()));
            writeTo.setYMax(mat.getVec3MultiplyY(this.getYMax()));

            return writeTo;
        }

        public unionRange<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            range: IReadonlyRange2d<TTypedArray>,
            writeTo: Range2d<TResult> = this.constructor.factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            writeTo[0] = this[0] > range[0] ? range[0] : this[0];
            writeTo[1] = this[1] < range[1] ? range[1] : this[1];
            writeTo[2] = this[2] > range[2] ? range[2] : this[2];
            writeTo[3] = this[3] < range[3] ? range[3] : this[3];

            return writeTo;
        }

        public extendRange<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            x: number,
            y: number,
            writeTo: Range2d<TResult> = this.constructor.factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            writeTo[0] = this[0] > x ? x : this[0];
            writeTo[1] = this[1] < x ? x : this[1];
            writeTo[2] = this[2] > y ? y : this[2];
            writeTo[3] = this[3] < y ? y : this[3];

            return writeTo;
        }

        public getRangeTransform<TArray extends TTypedArray = InstanceType<TCtor>>
        (
            toRange: IReadonlyRange2d<TTypedArray>,
            result: Mat3<TArray> = this.constructor.mat3Ctor.factory.createOneEmpty() as Mat3<TArray>,
        )
            : Mat3<TArray>
        {
            _BUILD.DEBUG && _Debug.runBlock(() =>
            {
                _Debug.assert(this.getXRange() !== 0, "divide by 0");
                _Debug.assert(this.getYRange() !== 0, "divide by 0");
            });

            const xSf = toRange.getXRange() / this.getXRange();
            const ySf = toRange.getYRange() / this.getYRange();

            result[0] = xSf;
            result[1] = 0;
            result[2] = 0;
            result[3] = 0;
            result[4] = ySf;
            result[5] = 0;
            result[6] = toRange.getXMin() - this.getXMin() * xSf;
            result[7] = toRange.getYMin() - this.getYMin() * ySf;
            result[8] = 1;

            return result;
        }

        public isPointInRange(point: IReadonlyVec2<TTypedArray>): boolean
        {
            const x = point.getX();
            const y = point.getY();

            return x >= this.getXMin() && x <= this.getXMax() && y >= this.getYMin() && y <= this.getYMax();
        }

        public doesRangeIntersect(range: IReadonlyRange2d<TTypedArray>): boolean
        {
            return (Math.abs((this[0] + this[1]) - (range[0] + range[1])) < (this.getXRange() + range.getXRange()))
                   && (Math.abs(((this[2] + this[3])) - (range[2] + range[3])) < (this.getYRange() + range.getYRange()));
        }

        public containsRange(range: IReadonlyRange2d<TTypedArray>): boolean
        {
            return this.getXMin() <= range.getXMin()
                   && this.getXMax() >= range.getXMax()
                   && this.getYMin() <= range.getYMin()
                   && this.getYMax() >= range.getYMax();
        }

        public scaleRelativeTo<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            scalingFactor: number,
            relativeTo: IReadonlyVec2<TTypedArray>,
            result: Range2d<TResult> = this.constructor.factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            _BUILD.DEBUG && _Debug.assert(this.isPointInRange(relativeTo), "relativeTo must be inside the range");

            const difference = this
                .getCenter(this.constructor.tmpVec)
                .subtract(relativeTo, this.constructor.tmpVec);

            // multiply by 2 as we want to compare to half the range
            // make the difference relative, varies from -1 to 1
            difference.setX(2 * difference.getX() / this.getXRange());
            difference.setY(2 * difference.getY() / this.getYRange());

            const newXRange = this.getXRange() * scalingFactor;
            const newYRange = this.getYRange() * scalingFactor;

            const halfXDiff = 0.5 * (this.getXRange() - newXRange);
            const halfYDiff = 0.5 * (this.getYRange() - newYRange);

            const newXMin = this.getXMin() + halfXDiff - halfXDiff * difference.getX();
            result.setXMin(newXMin);
            result.setXMax(newXMin + newXRange);

            const newYMin = this.getYMin() + halfYDiff - halfYDiff * difference.getY();
            result.setYMin(newYMin);
            result.setYMax(newYMin + newYRange);

            return result;
        }

        public bound(boundTo: IReadonlyRange2d<TTypedArray>): void
        {
            if (this.getXRange() > boundTo.getXRange())
            {
                this.setXMin(boundTo.getXMin());
                this.setXMax(boundTo.getXMax());
            }
            else if (this.getXMax() > boundTo.getXMax())
            {
                const range = this.getXRange();
                this.setXMax(boundTo.getXMax());
                this.setXMin(boundTo.getXMax() - range);
            }
            else if (this.getXMin() < boundTo.getXMin())
            {
                const range = this.getXRange();
                this.setXMin(boundTo.getXMin());
                this.setXMax(boundTo.getXMin() + range);
            }

            if (this.getYRange() > boundTo.getYRange())
            {
                this.setYMin(boundTo.getYMin());
                this.setYMax(boundTo.getYMax());
            }
            else if (this.getYMax() > boundTo.getYMax())
            {
                const range = this.getYRange();
                this.setYMax(boundTo.getYMax());
                this.setYMin(boundTo.getYMax() - range);
            }
            else if (this.getYMin() < boundTo.getYMin())
            {
                const range = this.getYRange();
                this.setYMin(boundTo.getYMin());
                this.setYMax(boundTo.getYMin() + range);
            }
        }

        public ensureAABB(): void
        {
            if (this[0] > this[1])
            {
                const tmp = this[0];
                this[0] = this[1];
                this[1] = tmp;
            }

            if (this[2] > this[3])
            {
                const tmp = this[2];
                this[2] = this[3];
                this[3] = tmp;
            }
        }

        public ensureMinRange
        (
            xMinRange: number,
            yMinRange: number,
        )
            : void
        {
            const xRange = this.getXRange();

            if (xRange < xMinRange)
            {
                const diff = (xMinRange - xRange) * 0.5;
                this.setXMin(this.getXMin() - diff);
                this.setXMax(this.getXMax() + diff);
            }

            const yRange = this.getYRange();

            if (yRange < yMinRange)
            {
                const diff = (yMinRange - yRange) * 0.5;
                this.setYMin(this.getYMin() - diff);
                this.setYMax(this.getYMax() + diff);
            }
        }

        public translateBy(dx: number, dy: number): void
        {
            this.setXMin(this.getXMin() + dx);
            this.setXMax(this.getXMax() + dx);

            this.setYMin(this.getYMin() + dy);
            this.setYMax(this.getYMax() + dy);
        }

        private static readonly tmpVec = Range2dImpl.vec2Ctor.factory.createOneEmpty();

        public TTypeGuardRange2d!: true;
    } as IRange2dCtor<InstanceType<TCtor>>;
}
