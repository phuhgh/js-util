import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { Mat4, IMat4Ctor, TMat4CtorArgs } from "./mat4";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat4Factory } from "./mat4-factory";
import { _Debug } from "../../../debug/_debug";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { Vec4 } from "../vec4/vec4";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
export function getMat4Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IMat4Ctor<InstanceType<TCtor>>
{
    return class Mat4Impl extends (ctor as unknown as ITypedArrayCtor<Mat4<InstanceType<TCtor>>>)
    {
        public static factory: ITypedArrayTupleFactory<Mat4<InstanceType<TCtor>>, TMat4CtorArgs> = new Mat4Factory(Mat4Impl, NormalizedDataViewProvider.getView(ctor));
        protected static vec4Ctor = Vec4.getCtor(ctor);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 16,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
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
            writeTo: Vec4<TResult> = (this.constructor as typeof Mat4Impl).vec4Ctor.factory.createOneEmpty() as Vec4<TResult>,
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
            writeFrom: Vec4<TTypedArray>,
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
    };
}