import { TTypedArray } from "../../t-typed-array";
import { ITypedArrayCtor } from "../../i-typed-array-ctor";
import { Mat2 } from "../../mat2/mat2";
import { INormalizedDataView } from "../../normalized-data-view/i-normalized-data-view";
import { Margin2d, Margin2dCtor, TMargin2dCtorArgs } from "./margin2d";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { Mat2Factory } from "../../mat2/mat2-factory";
import { Range2d } from "../range2d/range2d";
import { getRange2dCtor } from "../range2d/get-range2d-ctor";

/**
 * @internal
 */
export function getMargin2dCtor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Mat2<TArray>>, dataView: INormalizedDataView): Margin2dCtor<TArray>
{
    return class Margin2dImpl extends (getRange2dCtor(ctor, dataView) as Margin2dCtor<TArray>) implements Margin2d<TArray>
    {
        public static factory: ITypedArrayTupleFactory<Margin2d<TArray>, TMargin2dCtorArgs> = new Mat2Factory(Margin2dImpl, dataView);

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
            range: Readonly<Range2d<TArray>>,
            result: Range2d<TArray> = (this.constructor as Margin2dCtor<TArray>).factory.createOneEmpty(),
        )
            : Range2d<TArray>
        {
            result[0] = range[0] + this[0];
            result[1] = range[1] - this[1];
            result[2] = range[2] + this[2];
            result[3] = range[3] - this[3];

            return result;
        }

        public TTypeGuardAMargin2d!: true;

    } as Margin2dCtor<TArray>;
}