import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { Mat4, Mat4Ctor, TMat4CtorArgs } from "./mat4";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Mat4Factory } from "./mat4-factory";
import { _Debug } from "../../../debug/_debug";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";

/**
 * @internal
 */
export function getMat4Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Mat4Ctor<InstanceType<TCtor>>
{
    return class Mat4Impl extends (ctor as unknown as ITypedArrayCtor<Mat4<InstanceType<TCtor>>>)
    {
        public static factory: ITypedArrayTupleFactory<Mat4<InstanceType<TCtor>>, TMat4CtorArgs> = new Mat4Factory(Mat4Impl, NormalizedDataViewProvider.getView(ctor));

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