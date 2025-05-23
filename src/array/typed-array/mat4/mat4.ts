import { ATypedArrayTuple, TTypedArrayTupleMutativeMethods } from "../a-typed-array-tuple.js";
import { TTypedArray } from "../t-typed-array.js";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { getMat4Ctor } from "./get-mat4-ctor.js";
import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { IReadonlyVec4, Vec4 } from "../vec4/vec4.js";
import { TPickExcept } from "../../../typescript/t-pick-except.js";
import { populateTypedArrayConstructorMap } from "../../../runtime/rtti-interop.js";

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
 * Constructor for {@link Mat4}.
 */
export interface IMat4Ctor<TArray extends TTypedArray>
{
    readonly BASE: TTypedArrayCtor;
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Mat4<TArray>;
    readonly factory: ITypedArrayTupleFactory<Mat4<TArray>, TMat4CtorArgs>;
    new(): Mat4<TArray>;
}

/**
 * @public
 * {@link Mat4}.
 */
export interface IReadonlyMat4<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Mat4<TArray>>,
        | "setValueAt"
        | "setRow"
        | "copyFromBuffer"
        | TTypedArrayTupleMutativeMethods>
{
}

/**
 * @public
 * Row major 4x4 matrix.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Mat4<TArray extends TTypedArray> extends ATypedArrayTuple<16, TArray>
{
    public static f64: IMat4Ctor<Float64Array> = getMat4Ctor(Float64Array);
    public static f32: IMat4Ctor<Float32Array> = getMat4Ctor(Float32Array);
    public static i64 = null; // not supported
    public static u64 = null; // not supported
    public static u32: IMat4Ctor<Uint32Array> = getMat4Ctor(Uint32Array);
    public static i32: IMat4Ctor<Int32Array> = getMat4Ctor(Int32Array);
    public static u16: IMat4Ctor<Uint16Array> = getMat4Ctor(Uint16Array);
    public static i16: IMat4Ctor<Int16Array> = getMat4Ctor(Int16Array);
    public static u8c: IMat4Ctor<Uint8ClampedArray> = getMat4Ctor(Uint8ClampedArray);
    public static u8: IMat4Ctor<Uint8Array> = getMat4Ctor(Uint8Array);
    public static i8: IMat4Ctor<Int8Array> = getMat4Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IMat4Ctor<InstanceType<TCtor>>
    {
        return Mat4.constructors.get(ctor) as IMat4Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Mat4);

    public ["constructor"]!: IMat4Ctor<TArray>;

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
     * c4r1
     */
    public 3!: number;
    /**
     * c1r2
     */
    public 4!: number;
    /**
     * c2r2
     */
    public 5!: number;
    /**
     * c3r2
     */
    public 6!: number;
    /**
     * c4r2
     */
    public 7!: number;
    /**
     * c1r3
     */
    public 8!: number;
    /**
     * c2r3
     */
    public 9!: number;
    /**
     * c3r3
     */
    public 10!: number;
    /**
     * c4r3
     */
    public 11!: number;
    /**
     * c1r4
     */
    public 12!: number;
    /**
     * c2r4
     */
    public 13!: number;
    /**
     * c3r4
     */
    public 14!: number;
    /**
     * c4r4
     */
    public 15!: number;

    /**
     * Component-wise equals.
     */
    public isEqualTo(_other: Mat4<TTypedArray>): boolean
    {
        throw new Error();
    }

    public setIdentityMatrix(): Mat4<TArray>
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
        _writeTo?: Vec4<TResult>,
    )
        : Vec4<TResult>
    {
        throw new Error();
    }

    public setRow(_row: number, _writeFrom: IReadonlyVec4<TTypedArray>): void
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

    protected TTypeGuardMat4!: true;
}

/**
 * @public
 * Float32 {@link Mat4}.
 */
export type TF32Mat4 = Mat4<Float32Array>;

/**
 * @public
 * Float64 {@link Mat4}.
 */
export type TF64Mat4 = Mat4<Float64Array>;