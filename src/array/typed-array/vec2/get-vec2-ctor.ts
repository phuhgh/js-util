import { ITypedArrayCtor } from "../i-typed-array-ctor.js";
import { IReadonlyVec2, IVec2Ctor, Vec2 } from "./vec2.js";
import { Vec2Factory } from "./vec2-factory.js";
import { IReadonlyMat3 } from "../mat3/mat3.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { IReadonlyRange2d } from "../2d/range2d/range2d.js";
import { TTypedArray } from "../t-typed-array.js";

/**
 * @internal
 */
export function getVec2Ctor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : IVec2Ctor<InstanceType<TCtor>>
{
    return class Vec2Impl
        extends (ctor as unknown as ITypedArrayCtor<Vec2<InstanceType<TCtor>>>)
    {
        public static readonly BASE: TTypedArrayCtor = ctor;
        public static factory: Vec2Factory<Vec2<InstanceType<TCtor>>> = new Vec2Factory(Vec2Impl, NormalizedDataViewProvider.getView(ctor));

        public ["constructor"]!: typeof Vec2Impl;

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 2,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override isEqualTo(other: Vec2<TTypedArray>): boolean
        {
            return this[0] === other[0] && this[1] === other[1];
        }

        public override getX(): number
        {
            return this[0];
        }

        public override getY(): number
        {
            return this[1];
        }

        public getMagnitude(): number
        {
            const x = this[0];
            const y = this[1];
            return Math.sqrt(x * x + y * y);
        }

        public override getMagnitudeSquared(): number
        {
            const x = this[0];
            const y = this[1];
            return x * x + y * y;
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
            vec: IReadonlyVec2<TTypedArray>,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] + vec[0];
            result[1] = this[1] + vec[1];

            return result;
        }

        public override subtract<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            vec: IReadonlyVec2<TTypedArray>,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] - vec[0];
            result[1] = this[1] - vec[1];

            return result;
        }

        public vec2Multiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: IReadonlyVec2<TTypedArray>,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] * value[0];
            result[1] = this[1] * value[1];

            return result;
        }

        public override scalarMultiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: number,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] * value;
            result[1] = this[1] * value;

            return result;
        }

        public vec2Divide<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: IReadonlyVec2<TTypedArray>,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] / value[0];
            result[1] = this[1] / value[1];

            return result;
        }

        public override scalarDivide<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: number,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[0] / value;
            result[1] = this[1] / value;

            return result;
        }

        public override normalize<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            const magnitude = this.getMagnitude();
            this.scalarDivide(magnitude, result);

            return result;
        }

        public override getNormal<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = this[1];
            result[1] = -this[0];

            return result;
        }

        public override dotProduct
        (
            vec: IReadonlyVec2<TTypedArray>,
        )
            : number
        {
            return this[0] * vec[0] + this[1] * vec[1];
        }

        public override mat3Multiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: IReadonlyMat3<TTypedArray>,
            result: Vec2<TResult> = this.constructor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            result[0] = mat[0] * this[0] + mat[3] * this[0] + mat[6];
            result[1] = mat[1] * this[1] + mat[4] * this[1] + mat[7];

            return result;
        }

        public override bound2d(range: IReadonlyRange2d<TTypedArray>): void
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

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1]],
            ];
        }

        public copyFromBuffer
        (
            memoryDataView: DataView,
            pointer: number,
            littleEndian?: boolean,
        )
            : void
        {
            this.constructor.factory.copyFromBuffer(memoryDataView, pointer, this, littleEndian);
        }

        public copyToBuffer
        (
            memoryDataView: DataView,
            pointer: number,
            littleEndian?: boolean,
        )
            : void
        {
            this.constructor.factory.copyToBuffer(memoryDataView, this, pointer, littleEndian);
        }

        public castToBaseType(): InstanceType<TCtor>
        {
            return this as InstanceType<TCtor>;
        }
    };
}