import { Range2d, Range2dCtor, TRange2dCtorArgs } from "./range2d";
import { getMat2Ctor } from "../../mat2/get-mat2-ctor";
import { Vec2 } from "../../vec2/vec2";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider";
import { getVec2Factory } from "../../vec2/vec2-factory-by-type";

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
        protected static vec2Factory = getVec2Factory(ctor);

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

        public getRange(result: Vec2<InstanceType<TCtor>>): Vec2<InstanceType<TCtor>>
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

        public getCenter(result: Vec2<InstanceType<TCtor>>): Vec2<InstanceType<TCtor>>
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
            range: Readonly<Range2d<InstanceType<TCtor>>>,
            writeTo: Range2d<InstanceType<TCtor>> = (this.constructor as Range2dCtor<InstanceType<TCtor>>).factory.createOneEmpty(),
        )
            : Range2d<InstanceType<TCtor>>
        {
            writeTo[0] = this[0] > range[0] ? range[0] : this[0];
            writeTo[1] = this[1] < range[1] ? range[1] : this[1];
            writeTo[2] = this[2] > range[2] ? range[2] : this[2];
            writeTo[3] = this[3] < range[3] ? range[3] : this[3];

            return writeTo;
        }

        public isPointInRange(point: Vec2<InstanceType<TCtor>>): boolean
        {
            const x = point.getX();
            const y = point.getY();

            return x >= this.getXMin() && x <= this.getXMax() && y >= this.getYMin() && y <= this.getYMax();
        }

        public scale
        (
            _scalingFactor: number,
            _relativeTo: Vec2<InstanceType<TCtor>>,
            result: Range2d<InstanceType<TCtor>> = (this.constructor as Range2dCtor<InstanceType<TCtor>>).factory.createOneEmpty(),
        ): Range2d<InstanceType<TCtor>>
        {
            // const pointOffset = this
            //     .getCenter()
            //     .difference(relativeTo, this.tmp);

            return result;
        }

        // private tmp = Range2dImpl.factory.createOneEmpty();

        public TTypeGuardRange2d!: true;
    } as Range2dCtor<InstanceType<TCtor>>;
}