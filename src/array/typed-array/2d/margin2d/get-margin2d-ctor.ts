import { IMargin2dCtor, Margin2d, TMargin2dCtorArgs } from "./margin2d";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { Range2d } from "../range2d/range2d";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider";
import { getMat2Ctor } from "../../mat2/get-mat2-ctor";
import { Mat3 } from "../../mat3/mat3";
import { TTypedArray } from "../../t-typed-array";

/**
 * @internal
 */
export function getMargin2dCtor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : IMargin2dCtor<InstanceType<TCtor>>
{
    return class Margin2dImpl extends getMat2Ctor(ctor) implements Margin2d<InstanceType<TCtor>>
    {
        public static factory: ITypedArrayTupleFactory<Margin2d<InstanceType<TCtor>>, TMargin2dCtorArgs> = new Mat2Factory(Margin2dImpl, NormalizedDataViewProvider.getView(ctor));
        private static rangeCtor = Range2d.getCtor(ctor);

        public ["constructor"]: typeof Margin2dImpl;

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

        public getInnerRange<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            range: Readonly<Range2d<TTypedArray>>,
            result: Range2d<TResult> = this.constructor.rangeCtor.factory.createOneEmpty() as Range2d<TResult>,
        )
            : Range2d<TResult>
        {
            result[0] = range[0] + this[0]; // xMin
            result[1] = range[1] - this[1]; // xMax
            result[2] = range[2] + this[3]; // yMin
            result[3] = range[3] - this[2]; // yMax

            return result;
        }

        public mat3TransformLength<TResult extends TTypedArray = InstanceType<TCtor>>
        (
            mat: Readonly<Mat3<TTypedArray>>,
            writeTo: Margin2d<TResult> = this.constructor.factory.createOneEmpty() as Margin2d<TResult>,
        )
            : Margin2d<TResult>
        {
            writeTo.setLeft(mat.getTransformedXLength(0, this.getLeft()));
            writeTo.setRight(mat.getTransformedXLength(0, this.getRight()));
            writeTo.setTop(mat.getTransformedYLength(0, this.getTop()));
            writeTo.setBottom(mat.getTransformedYLength(0, this.getBottom()));

            return writeTo;
        }

        public TTypeGuardAMargin2d!: true;

    } as IMargin2dCtor<InstanceType<TCtor>>;
}