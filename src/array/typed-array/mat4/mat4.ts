import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { AMat4 } from "./a-mat4";
import { Mat4Factory } from "./mat4-factory";
import { _Debug } from "../../../debug/_debug";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 */
export type TMat4CtorArgs = [
    c1r1: number,
    c2r1: number,
    c3r1: number,
    c4r1: number,
    c1r2: number,
    c2r2: number,
    c3r2: number,
    c4r2: number,
    c1r3: number,
    c2r3: number,
    c3r3: number,
    c4r3: number,
    c1r4: number,
    c2r4: number,
    c3r4: number,
    c4r4: number,
];

/**
 * @public
 * Provider of typed array tuple {@link AMat4}. See static properties for factories and instance members for utilities.
 */
export class Mat4<TArray extends TTypedArray>
{
    public static f64: Mat4<Float64Array> = new Mat4(new Mat4Factory(Float64Array));
    public static f32: Mat4<Float32Array> = new Mat4(new Mat4Factory(Float32Array));
    public static u32: Mat4<Uint32Array> = new Mat4(new Mat4Factory(Uint32Array));
    public static i32: Mat4<Int32Array> = new Mat4(new Mat4Factory(Int32Array));
    public static u16: Mat4<Uint16Array> = new Mat4(new Mat4Factory(Uint16Array));
    public static i16: Mat4<Int16Array> = new Mat4(new Mat4Factory(Int16Array));
    public static u8c: Mat4<Uint8ClampedArray> = new Mat4(new Mat4Factory(Uint8ClampedArray));
    public static u8: Mat4<Uint8Array> = new Mat4(new Mat4Factory(Uint8Array));
    public static i8: Mat4<Int8Array> = new Mat4(new Mat4Factory(Int8Array));

    protected constructor
    (
        public factory: ITypedArrayTupleFactory<AMat4<TArray>, TMat4CtorArgs>,
    )
    {
    }

    public createIdentityMatrix(): AMat4<TArray>
    {
        const result = this.factory.createOneEmpty();

        result[0] = 1;
        result[5] = 1;
        result[10] = 1;
        result[15] = 1;

        return result;
    }

    public getIndex(column: number, row: number): Extract<keyof AMat4<never>, number>
    {
        DEBUG_MODE && _Debug.assert(column >= 0 && column < 4 && row >= 0 && row < 4, "out of bounds");
        return row * 4 + column as Extract<keyof AMat4<never>, number>;
    }

    public getLoggableValue(value: Readonly<AMat4<TArray>>): number[][]
    {
        return [
            [value[0], value[1], value[2], value[3]],
            [value[4], value[5], value[6], value[7]],
            [value[8], value[9], value[10], value[11]],
            [value[12], value[13], value[14], value[15]],
        ];
    }
}