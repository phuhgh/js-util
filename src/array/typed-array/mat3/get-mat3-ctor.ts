import { TTypedArray } from "../t-typed-array";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { Mat3, Mat3Ctor, TMat3CtorArgs } from "./mat3";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat3Factory } from "./mat3-factory";
import { _Debug } from "../../../debug/_debug";

/**
 * @internal
 */
export function getMat3Ctor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Mat3<TArray>>, dataView: INormalizedDataView): Mat3Ctor<TArray>
{
    return class Mat3Impl extends ctor
    {
        public static factory: ITypedArrayTupleFactory<Mat3<TArray>, TMat3CtorArgs> = new Mat3Factory(Mat3Impl, dataView);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 9,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override setIdentityMatrix(): Mat3<TArray>
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

        /**
         * counter clockwise
         */
        public override setRotationMatrix
        (
            angle: number,
        )
            : Mat3<TArray>
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

        public override setScalingMatrix(scalingFactorX: number, scalingFactorY: number): Mat3<TArray>
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
            : Mat3<TArray>
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

        public override multiplyMat3
        (
            mat: Readonly<Mat3<TArray>>,
            result: Mat3<TArray> = (this.constructor as Mat3Ctor<TArray>).factory.createOneEmpty(),
        )
            : Mat3<TArray>
        {
            const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this as unknown as number[];
            const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = mat as unknown as number[];

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