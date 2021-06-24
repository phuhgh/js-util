import { AVec3 } from "./a-vec3";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec3Factory } from "./vec3-factory";
import { AMat3 } from "../mat3/a-mat3";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 */
export type TVec3CtorArgs = [x: number, y: number, z: number];

/**
 * @public
 * Provider of typed array tuple {@link AVec3}. See static properties for factories and instance members for utilities.
 */
export class Vec3<TArray extends TTypedArray>
{
    public static f64: Vec3<Float64Array> = new Vec3(new Vec3Factory(Float64Array));
    public static f32: Vec3<Float32Array> = new Vec3(new Vec3Factory(Float32Array));
    public static u32: Vec3<Uint32Array> = new Vec3(new Vec3Factory(Uint32Array));
    public static i32: Vec3<Int32Array> = new Vec3(new Vec3Factory(Int32Array));
    public static u16: Vec3<Uint16Array> = new Vec3(new Vec3Factory(Uint16Array));
    public static i16: Vec3<Int16Array> = new Vec3(new Vec3Factory(Int16Array));
    public static u8c: Vec3<Uint8ClampedArray> = new Vec3(new Vec3Factory(Uint8ClampedArray));
    public static u8: Vec3<Uint8Array> = new Vec3(new Vec3Factory(Uint8Array));
    public static i8: Vec3<Int8Array> = new Vec3(new Vec3Factory(Int8Array));

    protected constructor
    (
        public readonly factory: ITypedArrayTupleFactory<AVec3<TArray>, TVec3CtorArgs>,
    )
    {
    }

    public getX(vec: Readonly<AVec3<TArray>>): number
    {
        return vec[0];
    }

    public getY(vec: Readonly<AVec3<TArray>>): number
    {
        return vec[1];
    }

    public getZ(vec: Readonly<AVec3<TArray>>): number
    {
        return vec[2];
    }

    public update(vec: AVec3<TArray>, x: number, y: number, z: number): void
    {
        vec[0] = x;
        vec[1] = y;
        vec[2] = z;
    }

    public setX(vec: AVec3<TArray>, x: number): void
    {
        vec[0] = x;
    }

    public setY(vec: AVec3<TArray>, y: number): void
    {
        vec[1] = y;
    }

    public setZ(vec: AVec3<TArray>, z: number): void
    {
        vec[2] = z;
    }

    public getMat3MultiplyX(a: Readonly<AMat3<TTypedArray>>, x: number): number
    {
        return a[0] * x + a[3] * x + a[6];
    }

    public getMat3MultiplyY(a: Readonly<AMat3<TTypedArray>>, y: number): number
    {
        return a[1] * y + a[4] * y + a[7];
    }

    public getLoggableValue(value: Readonly<AVec3<TArray>>): number[][]
    {
        return [
            [value[0], value[1], value[2]],
        ];
    }
}
