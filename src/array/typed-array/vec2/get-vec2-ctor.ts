import { TTypedArray } from "../t-typed-array";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { TVec2CtorArgs, Vec2, Vec2Ctor } from "./vec2";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec2Factory } from "./vec2-factory";
import { Mat3 } from "../mat3/mat3";

/**
 * @internal
 */
export function getVec2Ctor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Vec2<TArray>>, dataView: INormalizedDataView): Vec2Ctor<TArray>
{
    return class Vec2Impl extends ctor
    {
        public static factory: ITypedArrayTupleFactory<Vec2<TArray>, TVec2CtorArgs> = new Vec2Factory(Vec2Impl, dataView);

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

        public override add(vec: Readonly<Vec2<TArray>>, result: Vec2<TArray>): void
        {
            result[0] = this[0] + vec[0];
            result[1] = this[1] + vec[1];
        }

        public override dotProduct
        (
            vec: Readonly<Vec2<TArray>>,
            result: Vec2<TArray> = (this.constructor as Vec2Ctor<TArray>).factory.createOneEmpty(),
        )
            : Vec2<TArray>
        {
            result[0] = this[0] * vec[0];
            result[1] = this[1] * vec[1];

            return result;
        }

        public override mat3Multiply
        (
            mat: Readonly<Mat3<TArray>>,
            result: Vec2<TArray> = (this.constructor as Vec2Ctor<TArray>).factory.createOneEmpty(),
        )
            : Vec2<TArray>
        {
            result[0] = mat[0] * this[0] + mat[3] * this[0] + mat[6];
            result[1] = mat[1] * this[1] + mat[4] * this[1] + mat[7];

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