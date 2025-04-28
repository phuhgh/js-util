import { ATypedArrayTuple, TTypedArrayTupleMutativeMethods } from "../a-typed-array-tuple.js";
import { TTypedArray } from "../t-typed-array.js";
import { IReadonlyMat3 } from "../mat3/mat3.js";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { getVec2Ctor } from "./get-vec2-ctor.js";
import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { IReadonlyRange2d } from "../2d/range2d/range2d.js";
import { TPickExcept } from "../../../typescript/t-pick-except.js";
import { populateTypedArrayConstructorMap } from "../../../runtime/rtti-interop.js";

/**
 * @public
 */
export type TVec2CtorArgs = [x: number, y: number];

/**
 * @public
 * Constructor for {@link Vec2}.
 */
export interface IVec2Ctor<TArray extends TTypedArray>
{
    readonly BASE: TTypedArrayCtor;
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Vec2<TArray>;
    readonly factory: ITypedArrayTupleFactory<Vec2<TArray>, TVec2CtorArgs>;
    new(): Vec2<TArray>;
}

/**
 * @public
 * {@link Vec2}.
 */
export interface IReadonlyVec2<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Vec2<TArray>>,
        | "update"
        | "setX"
        | "setY"
        | "bound2d"
        | "translate2d"
        | "copyFromBuffer"
        | TTypedArrayTupleMutativeMethods>
{
}

/**
 * @public
 * Vector 2.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Vec2<TArray extends TTypedArray>
    extends ATypedArrayTuple<2, TArray>
{
    public static f64: IVec2Ctor<Float64Array> = getVec2Ctor(Float64Array);
    public static f32: IVec2Ctor<Float32Array> = getVec2Ctor(Float32Array);
    public static i64 = null; // not supported
    public static u64 = null; // not supported
    public static u32: IVec2Ctor<Uint32Array> = getVec2Ctor(Uint32Array);
    public static i32: IVec2Ctor<Int32Array> = getVec2Ctor(Int32Array);
    public static u16: IVec2Ctor<Uint16Array> = getVec2Ctor(Uint16Array);
    public static i16: IVec2Ctor<Int16Array> = getVec2Ctor(Int16Array);
    public static u8c: IVec2Ctor<Uint8ClampedArray> = getVec2Ctor(Uint8ClampedArray);
    public static u8: IVec2Ctor<Uint8Array> = getVec2Ctor(Uint8Array);
    public static i8: IVec2Ctor<Int8Array> = getVec2Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IVec2Ctor<InstanceType<TCtor>>
    {
        return Vec2.constructors.get(ctor) as IVec2Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Vec2);

    public ["constructor"]!: IVec2Ctor<TArray>;

    /**
     * x
     */
    public 0!: number;
    /**
     * y
     */
    public 1!: number;

    /**
     * Component-wise equals.
     */
    public isEqualTo(_other: Vec2<TTypedArray>): boolean
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

    public getMagnitude(): number
    {
        throw new Error();
    }

    public getMagnitudeSquared(): number
    {
        throw new Error();
    }

    public update(_x: number, _y: number): void
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

    public add<TResult extends TTypedArray = TArray>
    (
        _vec: IReadonlyVec2<TTypedArray>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    public subtract<TResult extends TTypedArray = TArray>
    (
        _vec: IReadonlyVec2<TTypedArray>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    public scalarMultiply<TResult extends TTypedArray = TArray>
    (
        _value: number,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    /**
     * Multiply `this` by `_value`.
     */
    public vec2Multiply<TResult extends TTypedArray = TArray>
    (
        _value: IReadonlyVec2<TTypedArray>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }


    public scalarDivide<TResult extends TTypedArray = TArray>
    (
        _value: number,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    /**
     * Divide `this` by `_value`.
     */
    public vec2Divide<TResult extends TTypedArray = TArray>
    (
        _value: IReadonlyVec2<TTypedArray>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    /**
     * Returns a unit vector in the direction of this vector.
     */
    public normalize<TResult extends TTypedArray = TArray>
    (
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    /**
     * Returns the normal to this vector.
     */
    public getNormal<TResult extends TTypedArray = TArray>
    (
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }


    public dotProduct
    (
        _vec: IReadonlyVec2<TTypedArray>,
    )
        : number
    {
        throw new Error();
    }

    public mat3Multiply<TResult extends TTypedArray = TArray>
    (
        _mat: IReadonlyMat3<TTypedArray>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    /**
     * If this point is outside of the range, set that dimension to the extrema of the range.
     * @param _range - The range to be bound to, inclusive.
     */
    public bound2d(_range: IReadonlyRange2d<TTypedArray>): void
    {
        throw new Error();
    }

    /**
     * Shifts this position by the arguments.
     */
    public translate2d(_dx: number, _dy: number): void
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

    public TTypeGuardVec2!: true;
}

/**
 * @public
 * Float32 {@link Vec2}.
 */
export type TF32Vec2 = Vec2<Float32Array>;

/**
 * @public
 * Float64 {@link Vec2}.
 */
export type TF64Vec2 = Vec2<Float64Array>;