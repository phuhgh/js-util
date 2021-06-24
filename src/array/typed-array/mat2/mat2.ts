import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AMat2 } from "./a-mat2";
import { _Debug } from "../../../debug/_debug";
import { Mat2Factory } from "./mat2-factory";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 */
export type TMat2CtorArgs = [c1r1: number, c2r1: number, c2r2: number, c2r2: number];

/**
 * @public
 * Provider of typed array tuple {@link AMat2}. See static properties for factories and instance members for utilities.
 */
export class Mat2<TArray extends TTypedArray>
{
    public static f64 = new Mat2(new Mat2Factory(Float64Array));
    public static f32 = new Mat2(new Mat2Factory(Float32Array));
    public static u32 = new Mat2(new Mat2Factory(Uint32Array));
    public static i32 = new Mat2(new Mat2Factory(Int32Array));
    public static u16 = new Mat2(new Mat2Factory(Uint16Array));
    public static i16 = new Mat2(new Mat2Factory(Int16Array));
    public static u8c = new Mat2(new Mat2Factory(Uint8ClampedArray));
    public static u8 = new Mat2(new Mat2Factory(Uint8Array));
    public static i8 = new Mat2(new Mat2Factory(Int8Array));

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AMat2<TArray>, TMat2CtorArgs>,
    )
    {
    }

    public createIdentityMatrix(): AMat2<TArray>
    {
        const result = this.factory.createOneEmpty();

        result[0] = 1;
        result[3] = 1;

        return result;
    }

    public getIndex(column: number, row: number): Extract<keyof Mat2<never>, number>
    {
        DEBUG_MODE && _Debug.assert(column >= 0 && column < 2 && row >= 0 && row < 2, "out of bounds");
        return row * 2 + column as Extract<keyof Mat2<never>, number> ;
    }

    public getLoggableValue(value: Readonly<AMat2<TArray>>): number[][]
    {
        return [
            [value[0], value[1]],
            [value[2], value[3]],
        ];
    }
}

