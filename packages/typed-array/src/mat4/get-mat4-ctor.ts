import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { IMat4Ctor, Mat4 } from "./mat4";
import { Mat4Factory } from "./mat4-factory";
import { _Debug } from "../../../debug/_debug";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { IReadonlyVec4, Vec4 } from "../vec4/vec4";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
export function getMat4Ctor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : IMat4Ctor<InstanceType<TCtor>>
{
    return class Mat4Impl
        extends (ctor as unknown as ITypedArrayCtor<Mat4<InstanceType<TCtor>>>)
    {
        public static factory: Mat4Factory<Mat4<InstanceType<TCtor>>> = new Mat4Factory(Mat4Impl, NormalizedDataViewProvider.getView(ctor));
        protected static vec4Ctor = Vec4.getCtor(ctor);

        public ["constructor"]: typeof Mat4Impl;

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 16,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override isEqualTo(other: Mat4<TTypedArray>): boolean
        {
            let isEqual = true;

            for (let i = 0; i < 16 && isEqual; ++i)
            {
                isEqual &&= this[i as 0] === other[i as 0];
            }

            return isEqual;
        }

        public override setIdentityMatrix(): Mat4<InstanceType<TCtor>>
        {
            this.fill(0);

            this[0] = 1;
            this[5] = 1;
            this[10] = 1;
            this[15] = 1;

            return this;
        }

        public override getValueAt(column: number, row: number): number
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 4 && row >= 0 && row < 4, "out of bounds");
            return this[row * 4 + column as Extract<keyof Mat4<never>, number>];
        }

        public override setValueAt(column: number, row: number, value: number): void
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 4 && row >= 0 && row < 4, "out of bounds");
            this[row * 4 + column as Extract<keyof Mat4<never>, number>] = value;
        }

        public override getRow<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            row: number,
            writeTo: Vec4<TResult> = this.constructor.vec4Ctor.factory.createOneEmpty() as Vec4<TResult>,
        )
            : Vec4<TResult>
        {
            DEBUG_MODE && _Debug.assert(row >= 0 && row < 4, "index out of bounds");

            writeTo[0] = this.getValueAt(0, row);
            writeTo[1] = this.getValueAt(1, row);
            writeTo[2] = this.getValueAt(2, row);
            writeTo[3] = this.getValueAt(3, row);

            return writeTo;
        }

        public override setRow
        (
            row: number,
            writeFrom: IReadonlyVec4<TTypedArray>,
        )
            : void
        {
            DEBUG_MODE && _Debug.assert(row >= 0 && row < 4, "index out of bounds");

            this.setValueAt(0, row, writeFrom[0]);
            this.setValueAt(1, row, writeFrom[1]);
            this.setValueAt(2, row, writeFrom[2]);
            this.setValueAt(3, row, writeFrom[3]);
        }

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1], this[2], this[3]],
                [this[4], this[5], this[6], this[7]],
                [this[8], this[9], this[10], this[11]],
                [this[12], this[13], this[14], this[15]],
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