import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { TVec2CtorArgs, Vec2, IVec2Ctor } from "./vec2";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec2Factory } from "./vec2-factory";
import { Mat3 } from "../mat3/mat3";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { Range2d } from "../2d/range2d/range2d";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
export function getVec2Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IVec2Ctor<InstanceType<TCtor>>
{
    return class Vec2Impl extends (ctor as unknown as ITypedArrayCtor<Vec2<InstanceType<TCtor>>>)
    {
        public static factory: ITypedArrayTupleFactory<Vec2<InstanceType<TCtor>>, TVec2CtorArgs> = new Vec2Factory(Vec2Impl, NormalizedDataViewProvider.getView(ctor));

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 2,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override getX(): number
        {
            return this[0];
        }

        public override getY(): number
        {
            return this[1];
        }

        public override update(x: number, y: number): void
        {
            this[0] = x;
            this[1] = y;
        }

        public override setX(x: number): void
        {
            this[0] = x;
        }

        public override setY(y: number): void
        {
            this[1] = y;
        }

        public override add<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            vec: Readonly<Vec2<TTypedArray>>,
            result: Vec2<TResult> = (this.constructor as typeof Vec2Impl).factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] + vec[0];
            result[1] = this[1] + vec[1];

            return result;
        }

        public override dotProduct<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            vec: Readonly<Vec2<TTypedArray>>,
            result: Vec2<TResult> = (this.constructor as typeof Vec2Impl).factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] * vec[0];
            result[1] = this[1] * vec[1];

            return result;
        }

        public override mat3Multiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: Readonly<Mat3<TTypedArray>>,
            result: Vec2<TResult> = (this.constructor as typeof Vec2Impl).factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = mat[0] * this[0] + mat[3] * this[0] + mat[6];
            result[1] = mat[1] * this[1] + mat[4] * this[1] + mat[7];

            return result;
        }

        public override bound2d(range: Range2d<TTypedArray>): void
        {
            if (this[0] < range.getXMin())
            {
                this[0] = range.getXMin();
            }
            else if (this[0] > range.getXMax())
            {
                this[0] = range.getXMax();
            }

            if (this[1] < range.getYMin())
            {
                this[1] = range.getYMin();
            }
            else if (this[1] > range.getYMax())
            {
                this[1] = range.getYMax();
            }
        }

        public override translate2d(dx: number, dy: number): void
        {
            this[0] += dx;
            this[1] += dy;
        }

        public override difference<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            vec: Vec2<TTypedArray>,
            result: Vec2<TResult> = (this.constructor as typeof Vec2Impl).factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result.update(
                this.getX() - vec.getX(),
                this.getY() - vec.getY()
            );

            return result;
        }

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1]],
            ];
        }
    };
}