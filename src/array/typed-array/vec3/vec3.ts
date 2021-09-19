import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getVec3Ctor } from "./get-vec3-ctor";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../populate-typed-array-constructor-map";
import { TPickExcept } from "../../../typescript/t-pick-except";

/**
 * @public
 */
export type TVec3CtorArgs = [x: number, y: number, z: number];

/**
 * @public
 * Constructor for {@link Vec3}.
 */
export interface IVec3Ctor<TArray extends TTypedArray>
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
 * {@link Vec3}.
 */
export interface IReadonlyVec3<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Vec3<TArray>>,
        | "update"
        | "setX"
        | "setY"
        | "setZ"
        | "copyFromBuffer">
{
}

/**
 * @public
 * Vector 3.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Vec3<TArray extends TTypedArray> extends ATypedArrayTuple<3, TArray>
{
    public static f64: IVec3Ctor<Float64Array> = getVec3Ctor(Float64Array);
    public static f32: IVec3Ctor<Float32Array> = getVec3Ctor(Float32Array);
    public static u32: IVec3Ctor<Uint32Array> = getVec3Ctor(Uint32Array);
    public static i32: IVec3Ctor<Int32Array> = getVec3Ctor(Int32Array);
    public static u16: IVec3Ctor<Uint16Array> = getVec3Ctor(Uint16Array);
    public static i16: IVec3Ctor<Int16Array> = getVec3Ctor(Int16Array);
    public static u8c: IVec3Ctor<Uint8ClampedArray> = getVec3Ctor(Uint8ClampedArray);
    public static u8: IVec3Ctor<Uint8Array> = getVec3Ctor(Uint8Array);
    public static i8: IVec3Ctor<Int8Array> = getVec3Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IVec3Ctor<InstanceType<TCtor>>
    {
        return Vec3.constructors.get(ctor) as IVec3Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Vec3);

    public ["constructor"]: IVec3Ctor<TArray>;

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

    public getMagnitude(): number
    {
        throw new Error();
    }

    public getMagnitudeSquared(): number
    {
        throw new Error();
    }

    public dotProduct
    (
        _vec: IReadonlyVec3<TTypedArray>,
    )
        : number
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

    /**
     * If endianness is not supplied the platform's endianness will be used.
     */
    public copyFromBuffer
    (
        _memoryDataView: DataView,
        _pointer: number,
        _littleEndian?: boolean,
    )
        : void
    {
        throw new Error();
    }

    /**
     * If endianness is not supplied the platform's endianness will be used.
     */
    public copyToBuffer
    (
        _memoryDataView: DataView,
        _pointer: number,
        _littleEndian?: boolean,
    )
        : void
    {
        throw new Error();
    }

    /**
     * Although the typed array tuples extend a typed array, they are not structurally compatible.
     * This function returns the argument passed without modification but cast as the underlying storage type, e.g. Float32Array.
     */
    public castToBaseType(): TArray
    {
        throw new Error();
    }

    public TTypeGuardVec3!: true;
}

/**
 * @public
 * Float32 {@link Vec3}.
 */
export type TF32Vec3 = Vec3<Float32Array>;

/**
 * @public
 * Float64 {@link Vec3}.
 */
export type TF64Vec3 = Vec3<Float64Array>;