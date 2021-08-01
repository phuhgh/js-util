import { Mat3, Mat3Ctor, TMat3CtorArgs } from "./mat3";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat3Factory } from "./mat3-factory";
import { _Debug } from "../../../debug/_debug";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { Mat2 } from "../mat2/mat2";
import { Vec3 } from "../vec3/vec3";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
export function getMat3Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Mat3Ctor<InstanceType<TCtor>>
{
    return class Mat3Impl extends (ctor as unknown as ITypedArrayCtor<Mat3<InstanceType<TCtor>>>)
    {
        public static factory: ITypedArrayTupleFactory<Mat3<InstanceType<TCtor>>, TMat3CtorArgs> = new Mat3Factory(Mat3Impl, NormalizedDataViewProvider.getView(ctor));
        protected static vec3Ctor = Vec3.getCtor(ctor);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 9,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override setIdentityMatrix(): Mat3<InstanceType<TCtor>>
        {
            this.fill(0);
            this[0] = 1;
            this[4] = 1;
            this[8] = 1;

            return this;
        }

        public override getValueAt(column: number, row: number): number
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 3 && row >= 0 && row < 3, "out of bounds");
            return this[row * 3 + column as Extract<keyof Mat3<never>, number>];
        }

        public override setValueAt(column: number, row: number, value: number): void
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 3 && row >= 0 && row < 3, "out of bounds");
            this[row * 3 + column as Extract<keyof Mat2<never>, number>] = value;
        }

        public override getRow<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            row: number,
            writeTo: Vec3<TResult> = (this.constructor as typeof Mat3Impl).vec3Ctor.factory.createOneEmpty() as Vec3<TResult>,
        )
            : Vec3<TResult>
        {
            DEBUG_MODE && _Debug.assert(row >= 0 && row < 3, "index out of bounds");

            writeTo[0] = this.getValueAt(0, row);
            writeTo[1] = this.getValueAt(1, row);
            writeTo[2] = this.getValueAt(2, row);

            return writeTo;
        }

        public override setRow
        (
            row: number,
            writeFrom: Vec3<TTypedArray>,
        )
            : void
        {
            DEBUG_MODE && _Debug.assert(row >= 0 && row < 3, "index out of bounds");

            this.setValueAt(0, row, writeFrom[0]);
            this.setValueAt(1, row, writeFrom[1]);
            this.setValueAt(2, row, writeFrom[2]);
        }

        public override setRotationMatrix
        (
            angle: number,
        )
            : Mat3<InstanceType<TCtor>>
        {
            const sine = Math.sin(angle);
            const cosine = Math.cos(angle);

            this[0] = cosine;
            this[1] = -sine;
            this[2] = 0;
            this[3] = sine;
            this[4] = cosine;
            this[5] = 0;
            this[6] = 0;
            this[7] = 0;
            this[8] = 1;

            return this;
        }

        public override setScalingMatrix(scalingFactorX: number, scalingFactorY: number): Mat3<InstanceType<TCtor>>
        {
            this[0] = scalingFactorX;
            this[1] = 0;
            this[2] = 0;
            this[3] = 0;
            this[4] = scalingFactorY;
            this[5] = 0;
            this[6] = 0;
            this[7] = 0;
            this[8] = 1;

            return this;
        }

        public override setTranslationMatrix
        (
            translationX: number,
            translationY: number,
        )
            : Mat3<InstanceType<TCtor>>
        {
            this[0] = 1;
            this[1] = 0;
            this[2] = 0;
            this[3] = 0;
            this[4] = 1;
            this[5] = 0;
            this[6] = translationX;
            this[7] = translationY;
            this[8] = 1;

            return this;
        }

        public multiplyMat3<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: Readonly<Mat3<TTypedArray>>,
            result: Mat3<TResult> = (this.constructor as typeof Mat3Impl).factory.createOneEmpty() as Mat3<TResult>,
        )
            : Mat3<TResult>
        {
            const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this as unknown as TMat3CtorArgs;
            const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = mat as unknown as TMat3CtorArgs;

            result[0] = a0 * b0 + a1 * b3 + a2 * b6;
            result[1] = a0 * b1 + a1 * b4 + a2 * b7;
            result[2] = a0 * b2 + a1 * b5 + a2 * b8;
            result[3] = a3 * b0 + a4 * b3 + a5 * b6;
            result[4] = a3 * b1 + a4 * b4 + a5 * b7;
            result[5] = a3 * b2 + a4 * b5 + a5 * b8;
            result[6] = a6 * b0 + a7 * b3 + a8 * b6;
            result[7] = a6 * b1 + a7 * b4 + a8 * b7;
            result[8] = a6 * b2 + a7 * b5 + a8 * b8;

            return result;
        }

        public override getVec3MultiplyX(x: number): number
        {
            return this[0] * x + this[3] * x + this[6];
        }

        public override getVec3MultiplyY(y: number): number
        {
            return this[1] * y + this[4] * y + this[7];
        }

        public override getTransformedXLength(min: number, max: number): number
        {
            return this.getVec3MultiplyX(max) - this.getVec3MultiplyX(min);
        }

        public override getTransformedYLength(min: number, max: number): number
        {
            return this.getVec3MultiplyY(max) - this.getVec3MultiplyY(min);
        }

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1], this[2]],
                [this[3], this[4], this[5]],
                [this[6], this[7], this[8]],
            ];
        }
    };
}