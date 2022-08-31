import { ATypedArrayTuple, TTypedArrayTupleMutativeMethods } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getVec4Ctor } from "./get-vec4-ctor";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../populate-typed-array-constructor-map";
import { TPickExcept } from "../../../typescript/t-pick-except";

/**
 * @public
 */
export type TVec4CtorArgs = [x: number, y: number, z: number, w: number];

/**
 * @public
 * Constructor for {@link Vec4}.
 */
export interface IVec4Ctor<TArray extends TTypedArray>
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
 * {@link Vec4}.
 */
export interface IReadonlyVec4<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Vec4<TArray>>,
        | "update"
        | "setX"
        | "setY"
        | "setZ"
        | "setW"
        | "copyFromBuffer"
        | TTypedArrayTupleMutativeMethods>
{
}

/**
 * @public
 * Vector 4.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Vec4<TArray extends TTypedArray> extends ATypedArrayTuple<4, TArray>
{
    public static f64: IVec4Ctor<Float64Array> = getVec4Ctor(Float64Array);
    public static f32: IVec4Ctor<Float32Array> = getVec4Ctor(Float32Array);
    public static u32: IVec4Ctor<Uint32Array> = getVec4Ctor(Uint32Array);
    public static i32: IVec4Ctor<Int32Array> = getVec4Ctor(Int32Array);
    public static u16: IVec4Ctor<Uint16Array> = getVec4Ctor(Uint16Array);
    public static i16: IVec4Ctor<Int16Array> = getVec4Ctor(Int16Array);
    public static u8c: IVec4Ctor<Uint8ClampedArray> = getVec4Ctor(Uint8ClampedArray);
    public static u8: IVec4Ctor<Uint8Array> = getVec4Ctor(Uint8Array);
    public static i8: IVec4Ctor<Int8Array> = getVec4Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IVec4Ctor<InstanceType<TCtor>>
    {
        return Vec4.constructors.get(ctor) as IVec4Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Vec4);

    public ["constructor"]!: IVec4Ctor<TArray>;

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

    /**
     * Component-wise equals.
     */
    public isEqualTo(_other: Vec4<TTypedArray>): boolean
    {
        throw new Error();
    }

    /**
     * @param _packedRGBA - The number to be unpacked.
     * @param _normalize - If true, normalize components between 0 - 1.
     */
    public setRGBAColor(_packedRGBA: number, _normalize?: boolean): Vec4<TArray>
    {
        throw new Error();
    }

    /**
     * @param _normalized - Format of the color stored in the Vec4, if true 0 - 1, else 0 - 255.
     */
    public getPackedRGBAColor(_normalized?: boolean): number
    {
        throw new Error();
    }

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

    public TTypeGuardVec4!: true;
}

/**
 * @public
 * Float32 {@link Vec4}.
 */
export type TF32Vec4 = Vec4<Float32Array>;

/**
 * @public
 * Float64 {@link Vec4}.
 */
export type TF64Vec4 = Vec4<Float64Array>;

