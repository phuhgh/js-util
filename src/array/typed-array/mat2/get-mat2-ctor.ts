import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { IMat2Ctor, IReadonlyMat2, Mat2, TMat2CtorArgs } from "./mat2";
import { Mat2Factory } from "./mat2-factory";
import { _Debug } from "../../../debug/_debug";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { Vec2 } from "../vec2/vec2";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
export function getMat2Ctor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor,
)
    : IMat2Ctor<InstanceType<TCtor>>
{
    return class Mat2Impl extends (ctor as unknown as ITypedArrayCtor<Mat2<InstanceType<TCtor>>>)
    {
        public static factory: Mat2Factory<Mat2<InstanceType<TCtor>>> = new Mat2Factory(Mat2Impl, NormalizedDataViewProvider.getView(ctor));
        protected static vec2Ctor = Vec2.getCtor(ctor);

        public ["constructor"]: typeof Mat2Impl;

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 4,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override update(a1: number, a2: number, a3: number, a4: number): void
        {
            this[0] = a1;
            this[1] = a2;
            this[2] = a3;
            this[3] = a4;
        }

        public override setIdentityMatrix(): Mat2<InstanceType<TCtor>>
        {
            this[0] = 1;
            this[1] = 0;
            this[2] = 0;
            this[3] = 1;

            return this;
        }

        public override getValueAt(column: number, row: number): number
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 2 && row >= 0 && row < 2, "out of bounds");
            return this[row * 2 + column as Extract<keyof Mat2<never>, number>];
        }

        public override setValueAt(column: number, row: number, value: number): void
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 2 && row >= 0 && row < 2, "out of bounds");
            this[row * 2 + column as Extract<keyof Mat2<never>, number>] = value;
        }

        public override setScalingMatrix(scalingFactor: number): Mat2<InstanceType<TCtor>>
        {
            this[0] = scalingFactor;
            this[1] = 0;
            this[2] = 0;
            this[3] = 1;

            return this;
        }

        public override setTranslationMatrix(translation: number): Mat2<InstanceType<TCtor>>
        {
            this[0] = 1;
            this[1] = 0;
            this[2] = translation;
            this[3] = 1;

            return this;
        }

        public override multiplyMat2<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: IReadonlyMat2<TTypedArray>,
            result: Mat2<TResult> = this.constructor.factory.createOneEmpty() as Mat2<TResult>,
        )
            : Mat2<TResult>
        {
            const [a0, a1, a2, a3] = this as unknown as TMat2CtorArgs;
            const [b0, b1, b2, b3] = mat as unknown as TMat2CtorArgs;

            result[0] = a0 * b0 + a1 * b2;
            result[1] = a0 * b1 + a1 * b3;
            result[2] = a2 * b0 + a3 * b2;
            result[3] = a2 * b1 + a3 * b3;

            return result;
        }

        public override getVec2MultiplyX(x: number): number
        {
            return this[0] * x + this[2];
        }

        public scalarMultiply<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: number,
            result: Mat2<TResult> = this.constructor.factory.createOneEmpty() as Mat2<TResult>,
        )
            : Mat2<TResult>
        {
            result[0] = this[0] * value;
            result[1] = this[1] * value;
            result[2] = this[2] * value;
            result[3] = this[3] * value;

            return result;
        }

        public scalarAdd<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            value: number,
            result: Mat2<TResult> = this.constructor.factory.createOneEmpty() as Mat2<TResult>,
        )
            : Mat2<TResult>
        {
            result[0] = this[0] + value;
            result[1] = this[1] + value;
            result[2] = this[2] + value;
            result[3] = this[3] + value;

            return result;
        }

        public override getRow<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            row: number,
            writeTo: Vec2<TResult> = this.constructor.vec2Ctor.factory.createOneEmpty() as Vec2<TResult>,
        )
            : Vec2<TResult>
        {
            DEBUG_MODE && _Debug.assert(row >= 0 && row < 2, "index out of bounds");

            writeTo[0] = this.getValueAt(0, row);
            writeTo[1] = this.getValueAt(1, row);

            return writeTo;
        }

        public override setRow
        (
            row: number,
            writeFrom: Vec2<TTypedArray>,
        )
            : void
        {
            DEBUG_MODE && _Debug.assert(row >= 0 && row < 2, "index out of bounds");

            this.setValueAt(0, row, writeFrom[0]);
            this.setValueAt(1, row, writeFrom[1]);
        }

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1]],
                [this[2], this[3]],
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