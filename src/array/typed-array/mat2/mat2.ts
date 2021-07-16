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
export interface Mat2Ctor<TArray extends TTypedArray>
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
 * See static properties for factories.
 */
export abstract class Mat2<TArray extends TTypedArray> extends ATypedArrayTuple<4>
{
    public static f64: Mat2Ctor<Float64Array> = getMat2Ctor(Float64Array);
    public static f32: Mat2Ctor<Float32Array> = getMat2Ctor(Float32Array);
    public static u32: Mat2Ctor<Uint32Array> = getMat2Ctor(Uint32Array);
    public static i32: Mat2Ctor<Int32Array> = getMat2Ctor(Int32Array);
    public static u16: Mat2Ctor<Uint16Array> = getMat2Ctor(Uint16Array);
    public static i16: Mat2Ctor<Int16Array> = getMat2Ctor(Int16Array);
    public static u8c: Mat2Ctor<Uint8ClampedArray> = getMat2Ctor(Uint8ClampedArray);
    public static u8: Mat2Ctor<Uint8Array> = getMat2Ctor(Uint8Array);
    public static i8: Mat2Ctor<Int8Array> = getMat2Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Mat2Ctor<InstanceType<TCtor>>
    {
        return Mat2.constructors.get(ctor) as Mat2Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Mat2);

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

    public getRow(_row: number, _writeTo?: Vec2<TArray>): Vec2<TArray>
    {
        throw new Error();
    }

    public setRow(_row: number, _writeFrom: Vec2<TArray>): void
    {
        throw new Error();
    }

    public getLoggableValue(): number[][]
    {
        throw new Error();
    }

    protected TTypeGuardMat2!: true;
    protected TTypeGuardTypedArray!: TArray;
}

/**
 * @public
 * Float32 {@link Mat2}.
 */
export type TF32Mat2 = Mat2<Float32Array>;