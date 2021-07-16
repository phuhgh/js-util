import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getMat3Ctor } from "./get-mat3-ctor";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../populate-typed-array-constructor-map";
import { Vec3 } from "../vec3/vec3";

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
export interface Mat3Ctor<TArray extends TTypedArray>
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
 * Row major 3x3 matrix.
 *
 * @remarks
 * See static properties for factories.
 */
export abstract class Mat3<TArray extends TTypedArray> extends ATypedArrayTuple<9>
{
    public static f64: Mat3Ctor<Float64Array> = getMat3Ctor(Float64Array);
    public static f32: Mat3Ctor<Float32Array> = getMat3Ctor(Float32Array);
    public static u32: Mat3Ctor<Uint32Array> = getMat3Ctor(Uint32Array);
    public static i32: Mat3Ctor<Int32Array> = getMat3Ctor(Int32Array);
    public static u16: Mat3Ctor<Uint16Array> = getMat3Ctor(Uint16Array);
    public static i16: Mat3Ctor<Int16Array> = getMat3Ctor(Int16Array);
    public static u8c: Mat3Ctor<Uint8ClampedArray> = getMat3Ctor(Uint8ClampedArray);
    public static u8: Mat3Ctor<Uint8Array> = getMat3Ctor(Uint8Array);
    public static i8: Mat3Ctor<Int8Array> = getMat3Ctor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Mat3Ctor<InstanceType<TCtor>>
    {
        return Mat3.constructors.get(ctor) as Mat3Ctor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Mat3);

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

    public getRow(_row: number, _writeTo?: Vec3<TArray>): Vec3<TArray>
    {
        throw new Error();
    }

    public setRow(_row: number, _writeFrom: Vec3<TArray>): void
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

    public multiplyMat3(_mat: Readonly<Mat3<TArray>>, _result?: Mat3<TArray>): Mat3<TArray>
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

    public getLoggableValue(): number[][]
    {
        throw new Error();
    }

    protected TTypeGuardMat3!: true;
    protected TTypeGuardTypedArray!: TArray;
}

/**
 * @public
 * Float32 {@link Mat3}.
 */
export type TF32Mat3 = Mat3<Float32Array>;
