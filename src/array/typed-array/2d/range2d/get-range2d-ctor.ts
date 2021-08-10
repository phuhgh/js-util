import { Range2d, Range2dCtor, TRange2dCtorArgs } from "./range2d";
import { getMat2Ctor } from "../../mat2/get-mat2-ctor";
import { Vec2 } from "../../vec2/vec2";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider";
import { _Debug } from "../../../../debug/_debug";
import { Mat3 } from "../../mat3/mat3";
import { TTypedArray } from "../../t-typed-array";

/**
 * @internal
 */
export function getRange2dCtor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : Range2dCtor<InstanceType<TCtor>>
{
    return class Range2dImpl extends getMat2Ctor(ctor) implements Range2d<InstanceType<TCtor>>
    {
        public static factory: ITypedArrayTupleFactory<Range2d<InstanceType<TCtor>>, TRange2dCtorArgs> = new Mat2Factory(Range2dImpl, NormalizedDataViewProvider.getView(ctor));
        protected static vec2Ctor = Vec2.getCtor(ctor);
        protected static mat3Ctor = Mat3.getCtor(ctor);

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
            result: Vec2<TResult> = (this.constructor as typeof Range2dImpl).vec2Ctor.factory.createOneEmpty() as Vec2<TResult>,
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

        public getCenter<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            result: Vec2<TResult> = (this.constructor as typeof Range2dImpl).vec2Ctor.factory.createOneEmpty() as Vec2<TResult>,
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
            mat: Readonly<Mat3<TTypedArray>>,
            writeTo: Range2d<TResult> = (this.constructor as typeof Range2dImpl).factory.createOneEmpty() as Range2d<TResult>,
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
            range: Readonly<Range2d<TTypedArray>>,
            writeTo: Range2d<TResult> = (this.constructor as typeof Range2dImpl).factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            writeTo[0] = this[0] > range[0] ? range[0] : this[0];
            writeTo[1] = this[1] < range[1] ? range[1] : this[1];
            writeTo[2] = this[2] > range[2] ? range[2] : this[2];
            writeTo[3] = this[3] < range[3] ? range[3] : this[3];

            return writeTo;
        }

        public getRangeTransform<TArray extends TTypedArray = InstanceType<TCtor>>
        (
            toRange: Readonly<Range2d<TTypedArray>>,
            result: Mat3<TArray> = (this.constructor as typeof Range2dImpl).mat3Ctor.factory.createOneEmpty() as Mat3<TArray>,
        )
            : Mat3<TArray>
        {
            DEBUG_MODE && _Debug.runBlock(() =>
            {
                _Debug.assert(this.getXRange() !== 0, "divide by 0");
                _Debug.assert(this.getYRange() !== 0, "divide by 0");
            });

            const xSf = toRange.getXRange() / this.getXRange();
            const ySf = toRange.getYRange() / this.getYRange();
            const xTx = toRange.getXMin() - this.getXMin() * xSf;
            const yTx = toRange.getYMin() - this.getYMin() * ySf;
            const transformMatrix = (this.constructor as typeof Range2dImpl).tmpMat3;

            result.setScalingMatrix(xSf, ySf);
            transformMatrix.setTranslationMatrix(xTx, yTx);
            result.multiplyMat3(transformMatrix, result);

            return result;
        }

        public isPointInRange(point: Vec2<TTypedArray>): boolean
        {
            const x = point.getX();
            const y = point.getY();

            return x >= this.getXMin() && x <= this.getXMax() && y >= this.getYMin() && y <= this.getYMax();
        }

        public scaleRelativeTo<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            scalingFactor: number,
            relativeTo: Vec2<TTypedArray>,
            result: Range2d<TResult> = (this.constructor as typeof Range2dImpl).factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            DEBUG_MODE && _Debug.assert(this.isPointInRange(relativeTo), "relativeTo must be inside the range");

            const difference = this
                .getCenter((this.constructor as typeof Range2dImpl).tmpVec)
                .difference(relativeTo, (this.constructor as typeof Range2dImpl).tmpVec);

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

        public bound(boundTo: Range2d<TTypedArray>): void
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

        public translateBy(dx: number, dy: number): void
        {
            this.setXMin(this.getXMin() + dx);
            this.setXMax(this.getXMax() + dx);

            this.setYMin(this.getYMin() + dy);
            this.setYMax(this.getYMax() + dy);
        }

        private static readonly tmpVec = Range2dImpl.vec2Ctor.factory.createOneEmpty();
        private static readonly tmpMat3 = Range2dImpl.mat3Ctor.factory.createOneEmpty();

        public TTypeGuardRange2d!: true;
    } as Range2dCtor<InstanceType<TCtor>>;
}