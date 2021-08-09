import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { Mat3 } from "../mat3/mat3";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getVec2Ctor } from "./get-vec2-ctor";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../populate-typed-array-constructor-map";
import { Range2d } from "../2d/range2d/range2d";

/**
 * @public
 */
export type TVec2CtorArgs = [x: number, y: number];

/**
 * @public
 * Constructor for {@link Vec2}.
 */
export interface Vec2Ctor<TArray extends TTypedArray>
{
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
 * Vector 2.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Vec2<TArray extends TTypedArray> extends ATypedArrayTuple<2, TArray>
{
    public static f64: Vec2Ctor<Float64Array> = getVec2Ctor(Float64Array);
    public static f32: Vec2Ctor<Float32Array> = getVec2Ctor(Float32Array);
    public static u32: Vec2Ctor<Uint32Array> = getVec2Ctor(Uint32Array);
    public static i32: Vec2Ctor<Int32Array> = getVec2Ctor(Int32Array);
    public static u16: Vec2Ctor<Uint16Array> = getVec2Ctor(Uint16Array);
    public static i16: Vec2Ctor<Int16Array> = getVec2Ctor(Int16Array);
    public static u8c: Vec2Ctor<Uint8ClampedArray> = getVec2Ctor(Uint8ClampedArray);
    public static u8: Vec2Ctor<Uint8Array> = getVec2Ctor(Uint8Array);
    public static i8: Vec2Ctor<Int8Array> = getVec2Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Vec2Ctor<InstanceType<TCtor>>
    {
        return Vec2.constructors.get(ctor) as Vec2Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Vec2);

    /**
     * x
     */
    public 0!: number;
    /**
     * y
     */
    public 1!: number;

    public getX(): number
    {
        throw new Error();
    }

    public getY(): number
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
        _vec: Readonly<Vec2<TTypedArray>>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    public dotProduct<TResult extends TTypedArray = TArray>
    (
        _vec: Readonly<Vec2<TTypedArray>>,
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    public mat3Multiply<TResult extends TTypedArray = TArray>
    (
        _mat: Readonly<Mat3<TTypedArray>>,
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
    public bound2d(_range: Range2d<TTypedArray>): void
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

    public difference<TResult extends TTypedArray = TArray>
    (
        _vec: Vec2<TTypedArray>,
        _result?: Vec2<TResult>
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    public getLoggableValue(): number[][]
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