import { AVec2 } from "./a-vec2";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec2Factory } from "./vec2-factory";
import { AMat3 } from "../mat3/a-mat3";
import { TTypedArray } from "../t-typed-array";

/**
 * @public
 */
export type TVec2CtorArgs = [x: number, y: number];

/**
 * @public
 * Provider of typed array tuple {@link AVec2}. See static properties for factories and instance members for utilities.
 */
export class Vec2<TArray extends TTypedArray>
{
    public static f64 = new Vec2(new Vec2Factory(Float64Array));
    public static f32 = new Vec2(new Vec2Factory(Float32Array));
    public static u32 = new Vec2(new Vec2Factory(Uint32Array));
    public static i32 = new Vec2(new Vec2Factory(Int32Array));
    public static u16 = new Vec2(new Vec2Factory(Uint16Array));
    public static i16 = new Vec2(new Vec2Factory(Int16Array));
    public static u8c = new Vec2(new Vec2Factory(Uint8ClampedArray));
    public static u8 = new Vec2(new Vec2Factory(Uint8Array));
    public static i8 = new Vec2(new Vec2Factory(Int8Array));

    protected constructor
    (
        public readonly factory: ITypedArrayTupleFactory<AVec2<TArray>, TVec2CtorArgs>,
    )
    {
    }

    public getX(vec: Readonly<AVec2<TArray>>): number
    {
        return vec[0];
    }

    public getY(vec: Readonly<AVec2<TArray>>): number
    {
        return vec[1];
    }

    public update(vec: AVec2<TArray>, x: number, y: number): void
    {
        vec[0] = x;
        vec[1] = y;
    }

    public setX(vec: AVec2<TArray>, x: number): void
    {
        vec[0] = x;
    }

    public setY(vec: AVec2<TArray>, y: number): void
    {
        vec[1] = y;
    }

    public add(a: Readonly<AVec2<TArray>>, b: Readonly<AVec2<TArray>>, result: AVec2<TArray>): void
    {
        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
    }

    public dotProduct
    (
        a: Readonly<AVec2<TArray>>,
        b: Readonly<AVec2<TArray>>,
        result: AVec2<TArray> = this.factory.createOneEmpty(),
    )
        : AVec2<TArray>
    {
        result[0] = a[0] * b[0];
        result[1] = a[1] * b[1];

        return result;
    }

    public mat3Multiply
    (
        a: Readonly<AMat3<TArray>>,
        b: Readonly<AVec2<TArray>>,
        result: AVec2<TArray> = this.factory.createOneEmpty(),
    )
        : AVec2<TArray>
    {
        result[0] = a[0] * b[0] + a[3] * b[0] + a[6];
        result[1] = a[1] * b[1] + a[4] * b[1] + a[7];

        return result;
    }

    public getLoggableValue(value: Readonly<AVec2<TArray>>): number[][]
    {
        return [
            [value[0], value[1]],
        ];
    }
}
