import { Margin2d, Margin2dCtor, TMargin2dCtorArgs } from "./margin2d";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { Range2d } from "../range2d/range2d";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider";
import { getMat2Ctor } from "../../mat2/get-mat2-ctor";
import { Mat3 } from "../../mat3/mat3";

/**
 * @internal
 */
export function getMargin2dCtor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : Margin2dCtor<InstanceType<TCtor>>
{
    return class Margin2dImpl extends getMat2Ctor(ctor) implements Margin2d<InstanceType<TCtor>>
    {
        public static factory: ITypedArrayTupleFactory<Margin2d<InstanceType<TCtor>>, TMargin2dCtorArgs> = new Mat2Factory(Margin2dImpl, NormalizedDataViewProvider.getView(ctor));
        private static rangeCtor = Range2d.getCtor(ctor);

        public getLeft(): number
        {
            return this[0];
        }

        public getRight(): number
        {
            return this[1];
        }

        public getTop(): number
        {
            return this[2];
        }

        public getBottom(): number
        {
            return this[3];
        }

        public setLeft(value: number): void
        {
            this[0] = value;
        }

        public setRight(value: number): void
        {
            this[1] = value;
        }

        public setTop(value: number): void
        {
            this[2] = value;
        }

        public setBottom(value: number): void
        {
            this[3] = value;
        }

        public sumX(): number
        {
            return this[0] + this[1];
        }

        public sumY(): number
        {
            return this[2] + this[3];
        }

        public getInnerRange
        (
            range: Readonly<Range2d<InstanceType<TCtor>>>,
            result: Range2d<InstanceType<TCtor>> = (this.constructor as typeof Margin2dImpl).rangeCtor.factory.createOneEmpty(),
        )
            : Range2d<InstanceType<TCtor>>
        {
            result[0] = range[0] + this[0]; // xMin
            result[1] = range[1] - this[1]; // xMax
            result[2] = range[2] + this[3]; // yMin
            result[3] = range[3] - this[2]; // yMax

            return result;
        }

        public mat3TransformLength
        (
            mat: Readonly<Mat3<InstanceType<TCtor>>>,
            writeTo: Margin2d<InstanceType<TCtor>> = (this.constructor as typeof Margin2dImpl).factory.createOneEmpty(),
        )
            : Margin2d<InstanceType<TCtor>>
        {
            writeTo.setLeft(mat.getTransformedXLength(0, this.getLeft()));
            writeTo.setRight(mat.getTransformedXLength(0, this.getRight()));
            writeTo.setTop(mat.getTransformedYLength(0, this.getTop()));
            writeTo.setBottom(mat.getTransformedYLength(0, this.getBottom()));

            return writeTo;
        }

        public TTypeGuardAMargin2d!: true;

    } as Margin2dCtor<InstanceType<TCtor>>;
}