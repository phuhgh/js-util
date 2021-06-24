import { AVec4 } from "./a-vec4";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec4Factory } from "./vec4-factory";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 */
export type TVec4CtorArgs = [x: number, y: number, z: number, w: number];

/**
 * @public
 * Provider of typed array tuple {@link AVec4}. See static properties for factories and instance members for utilities.
 */
export class Vec4<TArray extends TTypedArray>
{
    public static f64: Vec4<Float64Array> = new Vec4(new Vec4Factory(Float64Array));
    public static f32: Vec4<Float32Array> = new Vec4(new Vec4Factory(Float32Array));
    public static u32: Vec4<Uint32Array> = new Vec4(new Vec4Factory(Uint32Array));
    public static i32: Vec4<Int32Array> = new Vec4(new Vec4Factory(Int32Array));
    public static u16: Vec4<Uint16Array> = new Vec4(new Vec4Factory(Uint16Array));
    public static i16: Vec4<Int16Array> = new Vec4(new Vec4Factory(Int16Array));
    public static u8c: Vec4<Uint8ClampedArray> = new Vec4(new Vec4Factory(Uint8ClampedArray));
    public static u8: Vec4<Uint8Array> = new Vec4(new Vec4Factory(Uint8Array));
    public static i8: Vec4<Int8Array> = new Vec4(new Vec4Factory(Int8Array));

    protected constructor
    (
        public readonly factory: ITypedArrayTupleFactory<AVec4<TArray>, TVec4CtorArgs>,
    )
    {
    }

    public getX(vec: Readonly<AVec4<TArray>>): number
    {
        return vec[0];
    }

    public getY(vec: Readonly<AVec4<TArray>>): number
    {
        return vec[1];
    }

    public getZ(vec: Readonly<AVec4<TArray>>): number
    {
        return vec[2];
    }

    public getW(vec: Readonly<AVec4<TArray>>): number
    {
        return vec[3];
    }

    public update(vec: AVec4<TArray>, x: number, y: number, z: number, w: number): void
    {
        vec[0] = x;
        vec[1] = y;
        vec[2] = z;
        vec[3] = w;
    }

    public setX(vec: AVec4<TArray>, x: number): void
    {
        vec[0] = x;
    }

    public setY(vec: AVec4<TArray>, y: number): void
    {
        vec[1] = y;
    }

    public setZ(vec: AVec4<TArray>, z: number): void
    {
        vec[2] = z;
    }

    public setW(vec: AVec4<TArray>, w: number): void
    {
        vec[3] = w;
    }

    public getLoggableValue(value: Readonly<AVec4<TArray>>): number[][]
    {
        return [
            [value[0], value[1], value[2]],
        ];
    }
}
