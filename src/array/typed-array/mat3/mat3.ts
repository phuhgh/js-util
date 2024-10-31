import { ATypedArrayTuple, TTypedArrayTupleMutativeMethods } from "../a-typed-array-tuple.js";
import { TTypedArray } from "../t-typed-array.js";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { getMat3Ctor } from "./get-mat3-ctor.js";
import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { IReadonlyVec3, Vec3 } from "../vec3/vec3.js";
import { TPickExcept } from "../../../typescript/t-pick-except.js";
import { populateTypedArrayConstructorMap } from "../rtti-interop.js";

/**
 * @public
 */
export type TMat3CtorArgs = [
    c1r1: number,
    c2r1: number,
    c3r1: number,
    c1r2: number,
    c2r2: number,
    c3r2: number,
    c1r3: number,
    c2r3: number,
    c3r3: number,
]

/**
 * @public
 * Constructor for {@link Mat3}.
 */
export interface IMat3Ctor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Mat3<TArray>;
    readonly factory: ITypedArrayTupleFactory<Mat3<TArray>, TMat3CtorArgs>;
    new(): Mat3<TArray>;
}

/**
 * @public
 * {@link Mat3}.
 */
export interface IReadonlyMat3<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Mat3<TArray>>,
        | "setValueAt"
        | "setRow"
        | "copyFromBuffer"
        | TTypedArrayTupleMutativeMethods>
{
}

/**
 * @public
 * Row major 3x3 matrix.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Mat3<TArray extends TTypedArray> extends ATypedArrayTuple<9, TArray>
{
    public static f64: IMat3Ctor<Float64Array> = getMat3Ctor(Float64Array);
    public static f32: IMat3Ctor<Float32Array> = getMat3Ctor(Float32Array);
    public static i64 = null; // not supported
    public static u64 = null; // not supported
    public static u32: IMat3Ctor<Uint32Array> = getMat3Ctor(Uint32Array);
    public static i32: IMat3Ctor<Int32Array> = getMat3Ctor(Int32Array);
    public static u16: IMat3Ctor<Uint16Array> = getMat3Ctor(Uint16Array);
    public static i16: IMat3Ctor<Int16Array> = getMat3Ctor(Int16Array);
    public static u8c: IMat3Ctor<Uint8ClampedArray> = getMat3Ctor(Uint8ClampedArray);
    public static u8: IMat3Ctor<Uint8Array> = getMat3Ctor(Uint8Array);
    public static i8: IMat3Ctor<Int8Array> = getMat3Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IMat3Ctor<InstanceType<TCtor>>
    {
        return Mat3.constructors.get(ctor) as IMat3Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Mat3);

    public ["constructor"]!: IMat3Ctor<TArray>;

    /**
     * c1r1
     */
    public 0!: number;
    /**
     * c2r1
     */
    public 1!: number;
    /**
     * c3r1
     */
    public 2!: number;
    /**
     * c1r2
     */
    public 3!: number;
    /**
     * c2r2
     */
    public 4!: number;
    /**
     * c3r2
     */
    public 5!: number;
    /**
     * c1r3
     */
    public 6!: number;
    /**
     * c2r3
     */
    public 7!: number;
    /**
     * c3r3
     */
    public 8!: number;

    /**
     * Component-wise equals.
     */
    public isEqualTo(_other: Mat3<TTypedArray>): boolean
    {
        throw new Error();
    }

    public setIdentityMatrix(): Mat3<TArray>
    {
        throw new Error();
    }

    public getValueAt(_column: number, _row: number): number
    {
        throw new Error();
    }

    public setValueAt(_column: number, _row: number, _value: number): void
    {
        throw new Error();
    }

    public getRow<TResult extends TTypedArray = TArray>
    (
        _row: number,
        _writeTo?: Vec3<TResult>
    )
        : Vec3<TResult>
    {
        throw new Error();
    }

    public setRow
    (
        _row: number,
        _writeFrom: IReadonlyVec3<TTypedArray>
    )
        : void
    {
        throw new Error();
    }

    /**
     * counter clockwise, in radians
     */
    public setRotationMatrix(_angle: number): Mat3<TArray>
    {
        throw new Error();
    }

    public setScalingMatrix(_scalingFactorX: number, _scalingFactorY: number): Mat3<TArray>
    {
        throw new Error();
    }

    public setTranslationMatrix(_translationX: number, _translationY: number): Mat3<TArray>
    {
        throw new Error();
    }

    public scalarMultiply<TResult extends TTypedArray = TArray>
    (
        _value: number,
        _result?: Mat3<TResult>,
    )
        : Mat3<TResult>
    {
        throw new Error();
    }

    public scalarAdd<TResult extends TTypedArray = TArray>
    (
        _value: number,
        _result?: Mat3<TResult>,
    )
        : Mat3<TResult>
    {
        throw new Error();
    }

    public multiplyMat3<TResult extends TTypedArray = TArray>
    (
        _mat: IReadonlyMat3<TTypedArray>,
        _result?: Mat3<TResult>,
    )
        : Mat3<TResult>
    {
        throw new Error();
    }

    public getVec3MultiplyX(_x: number): number
    {
        throw new Error();
    }

    public getVec3MultiplyY(_y: number): number
    {
        throw new Error();
    }

    /**
     * Apply this transform as if it were x in a vec3 to both min and max, return the difference.
     */
    public getTransformedXLength(_min: number, _max: number): number
    {
        throw new Error();
    }

    /**
     * Apply this transform as if it were y in a vec3 to both min and max, return the difference.
     */
    public getTransformedYLength(_min: number, _max: number): number
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

    protected TTypeGuardMat3!: true;
}

/**
 * @public
 * Float32 {@link Mat3}.
 */
export type TF32Mat3 = Mat3<Float32Array>;

/**
 * @public
 * Float64 {@link Mat3}.
 */
export type TF64Mat3 = Mat3<Float64Array>;
