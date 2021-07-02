import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getVec4Ctor } from "./get-vec4-ctor";

/**
 * @public
 */
export type TVec4CtorArgs = [x: number, y: number, z: number, w: number];

/**
 * @public
 * Constructor for {@link Vec4}.
 */
export interface Vec4Ctor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Vec4<TArray>;
    readonly factory: ITypedArrayTupleFactory<Vec4<TArray>, TVec4CtorArgs>;
    new(): Vec4<TArray>;
}

/**
 * @public
 * Vector 4.
 *
 * @remarks
 * See static properties for factories.
 */
export abstract class Vec4<TArray extends TTypedArray> extends ATypedArrayTuple<4>
{
    public static f64: Vec4Ctor<Float64Array> = getVec4Ctor(Float64Array);
    public static f32: Vec4Ctor<Float32Array> = getVec4Ctor(Float32Array);
    public static u32: Vec4Ctor<Uint32Array> = getVec4Ctor(Uint32Array);
    public static i32: Vec4Ctor<Int32Array> = getVec4Ctor(Int32Array);
    public static u16: Vec4Ctor<Uint16Array> = getVec4Ctor(Uint16Array);
    public static i16: Vec4Ctor<Int16Array> = getVec4Ctor(Int16Array);
    public static u8c: Vec4Ctor<Uint8ClampedArray> = getVec4Ctor(Uint8ClampedArray);
    public static u8: Vec4Ctor<Uint8Array> = getVec4Ctor(Uint8Array);
    public static i8: Vec4Ctor<Int8Array> = getVec4Ctor(Int8Array);

    /**
     * x
     */
    public 0!: number;
    /**
     * y
     */
    public 1!: number;
    /**
     * z
     */
    public 2!: number;
    /**
     * w
     */
    public 3!: number;

    public getX(): number
    {
        throw new Error();
    }

    public getY(): number
    {
        throw new Error();
    }

    public getZ(): number
    {
        throw new Error();
    }

    public getW(): number
    {
        throw new Error();
    }

    public update(_x: number, _y: number, _z: number, _w: number): void
    {
        throw new Error();
    }

    public setX(_x: number): void
    {
        throw new Error();
    }

    public setY(_y: number): void
    {
        throw new Error();
    }

    public setZ(_z: number): void
    {
        throw new Error();
    }

    public setW(_w: number): void
    {
        throw new Error();
    }

    public getLoggableValue(): number[][]
    {
        throw new Error();
    }

    public TTypeGuardVec4!: true;
    public TTypeGuardTypedArray!: TArray;
}

/**
 * @public
 * Float32 {@link Vec4}.
 */
export type TF32Vec4 = Vec4<Float32Array>;

