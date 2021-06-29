import { TTypedArray } from "../t-typed-array";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { Mat4, Mat4Ctor, TMat4CtorArgs } from "./mat4";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat4Factory } from "./mat4-factory";
import { _Debug } from "../../../debug/_debug";

/**
 * @internal
 */
export function getMat4Ctor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Mat4<TArray>>, dataView: INormalizedDataView): Mat4Ctor<TArray>
{
    return class Mat4Impl extends ctor
    {
        public static factory: ITypedArrayTupleFactory<Mat4<TArray>, TMat4CtorArgs> = new Mat4Factory(Mat4Impl, dataView);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 16,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override setIdentityMatrix(): Mat4<TArray>
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