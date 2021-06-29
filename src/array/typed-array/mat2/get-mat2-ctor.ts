import { TTypedArray } from "../t-typed-array";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { Mat2, Mat2Ctor, TMat2CtorArgs } from "./mat2";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat2Factory } from "./mat2-factory";
import { _Debug } from "../../../debug/_debug";

/**
 * @internal
 */
export function getMat2Ctor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Mat2<TArray>>, dataView: INormalizedDataView): Mat2Ctor<TArray>
{
    return class Mat2Impl extends ctor
    {
        public static factory: ITypedArrayTupleFactory<Mat2<TArray>, TMat2CtorArgs> = new Mat2Factory(Mat2Impl, dataView);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 4,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override setIdentityMatrix(): Mat2<TArray>
        {
            this.fill(0);
            this[0] = 1;
            this[3] = 1;

            return this;
        }

        public override getValueAt(column: number, row: number): number
        {
            DEBUG_MODE && _Debug.assert(column >= 0 && column < 2 && row >= 0 && row < 2, "out of bounds");
            return this[row * 2 + column as Extract<keyof Mat2<never>, number>];
        }

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1]],
                [this[2], this[3]],
            ];
        }
    };
}