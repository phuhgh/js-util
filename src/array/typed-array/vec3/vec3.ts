import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getVec3Ctor } from "./get-vec3-ctor";

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @public
 */
export type TVec3CtorArgs = [x: number, y: number, z: number];

/**
 * @public
 * Constructor for {@link Vec3}.
 */
export interface Vec3Ctor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Vec3<TArray>;
    readonly factory: ITypedArrayTupleFactory<Vec3<TArray>, TVec3CtorArgs>;
    new(): Vec3<TArray>;
}

/**
 * @public
 * Vector 3.
 *
 * @remarks
 * See static properties for factories.
 */
export abstract class Vec3<TArray extends TTypedArray> extends ATypedArrayTuple<3>
{
    public static f64: Vec3Ctor<Float64Array> = getVec3Ctor(Float64Array as any, NormalizedDataViewProvider.getView(Float64Array));
    public static f32: Vec3Ctor<Float32Array> = getVec3Ctor(Float32Array as any, NormalizedDataViewProvider.getView(Float32Array));
    public static u32: Vec3Ctor<Uint32Array> = getVec3Ctor(Uint32Array as any, NormalizedDataViewProvider.getView(Uint32Array));
    public static i32: Vec3Ctor<Int32Array> = getVec3Ctor(Int32Array as any, NormalizedDataViewProvider.getView(Int32Array));
    public static u16: Vec3Ctor<Uint16Array> = getVec3Ctor(Uint16Array as any, NormalizedDataViewProvider.getView(Uint16Array));
    public static i16: Vec3Ctor<Int16Array> = getVec3Ctor(Int16Array as any, NormalizedDataViewProvider.getView(Int16Array));
    public static u8c: Vec3Ctor<Uint8ClampedArray> = getVec3Ctor(Uint8ClampedArray as any, NormalizedDataViewProvider.getView(Uint8ClampedArray));
    public static u8: Vec3Ctor<Uint8Array> = getVec3Ctor(Uint8Array as any, NormalizedDataViewProvider.getView(Uint8Array));
    public static i8: Vec3Ctor<Int8Array> = getVec3Ctor(Int8Array as any, NormalizedDataViewProvider.getView(Int8Array));

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

    public update(_x: number, _y: number, _z: number): void
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

    public getLoggableValue(): number[][]
    {
        throw new Error();
    }

    public TTypeGuardVec3!: true;
    public TTypeGuardTypedArray!: TArray;
}

/**
 * @public
 * Float32 {@link Vec3}.
 */
export type TF32Vec3 = Vec3<Float32Array>;