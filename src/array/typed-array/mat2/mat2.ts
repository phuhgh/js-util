import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getMat2Ctor } from "./get-mat2-ctor";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../populate-typed-array-constructor-map";
import { Vec2 } from "../vec2/vec2";

/**
 * @public
 */
export type TMat2CtorArgs = [c1r1: number, c2r1: number, c2r2: number, c2r2: number];

/**
 * @public
 * Constructor for {@link Mat2}.
 */
export interface IMat2Ctor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Mat2<TArray>;
    readonly factory: ITypedArrayTupleFactory<Mat2<TArray>, TMat2CtorArgs>;
    new(): Mat2<TArray>;
}

/**
 * @public
 * Row major 2x2 matrix.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Mat2<TArray extends TTypedArray> extends ATypedArrayTuple<4, TArray>
{
    public static f64: IMat2Ctor<Float64Array> = getMat2Ctor(Float64Array);
    public static f32: IMat2Ctor<Float32Array> = getMat2Ctor(Float32Array);
    public static u32: IMat2Ctor<Uint32Array> = getMat2Ctor(Uint32Array);
    public static i32: IMat2Ctor<Int32Array> = getMat2Ctor(Int32Array);
    public static u16: IMat2Ctor<Uint16Array> = getMat2Ctor(Uint16Array);
    public static i16: IMat2Ctor<Int16Array> = getMat2Ctor(Int16Array);
    public static u8c: IMat2Ctor<Uint8ClampedArray> = getMat2Ctor(Uint8ClampedArray);
    public static u8: IMat2Ctor<Uint8Array> = getMat2Ctor(Uint8Array);
    public static i8: IMat2Ctor<Int8Array> = getMat2Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IMat2Ctor<InstanceType<TCtor>>
    {
        return Mat2.constructors.get(ctor) as IMat2Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Mat2);

    public ["constructor"]: IMat2Ctor<TArray>;

    /**
     * c1r1
     */
    public 0!: number;
    /**
     * c2r1
     */
    public 1!: number;
    /**
     * c2r2
     */
    public 2!: number;
    /**
     * c2r2
     */
    public 3!: number;

    public update(..._args: TMat2CtorArgs): void
    {
        throw new Error();
    }

    public setIdentityMatrix(): Mat2<TArray>
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

    public setScalingMatrix(_scalingFactor: number): Mat2<TArray>
    {
        throw new Error();
    }

    public setTranslationMatrix(_translation: number): Mat2<TArray>
    {
        throw new Error();
    }

    public multiplyMat2<TResult extends TTypedArray = TArray>
    (
        _mat: Readonly<Mat2<TTypedArray>>,
        _result?: Mat2<TResult>,
    )
        : Mat2<TResult>
    {
        throw new Error();
    }

    public getVec2MultiplyX(_x: number): number
    {
        throw new Error();
    }

    public getRow<TResult extends TTypedArray = TArray>
    (
        _row: number,
        _writeTo?: Vec2<TResult>,
    )
        : Vec2<TResult>
    {
        throw new Error();
    }

    public setRow(_row: number, _writeFrom: Vec2<TTypedArray>): void
    {
        throw new Error();
    }

    public getLoggableValue(): number[][]
    {
        throw new Error();
    }

    protected TTypeGuardMat2!: true;
}

/**
 * @public
 * Float32 {@link Mat2}.
 */
export type TF32Mat2 = Mat2<Float32Array>;

/**
 * @public
 * Float64 {@link Mat2}.
 */
export type TF64Mat2 = Mat2<Float64Array>;