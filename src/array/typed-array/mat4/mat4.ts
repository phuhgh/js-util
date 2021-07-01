import { ATypedArrayTuple } from "../a-typed-array-tuple";
import { TTypedArray } from "../t-typed-array";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { getMat4Ctor } from "./get-mat4-ctor";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
export interface Mat4Ctor<TArray extends TTypedArray>
{
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
 * Row major 4x4 matrix.
 *
 * @remarks
 * See static properties for factories.
 */
export abstract class Mat4<TArray extends TTypedArray> extends ATypedArrayTuple<16>
{
    public static f64: Mat4Ctor<Float64Array> = getMat4Ctor(Float64Array as any, NormalizedDataViewProvider.getView(Float64Array));
    public static f32: Mat4Ctor<Float32Array> = getMat4Ctor(Float32Array as any, NormalizedDataViewProvider.getView(Float32Array));
    public static u32: Mat4Ctor<Uint32Array> = getMat4Ctor(Uint32Array as any, NormalizedDataViewProvider.getView(Uint32Array));
    public static i32: Mat4Ctor<Int32Array> = getMat4Ctor(Int32Array as any, NormalizedDataViewProvider.getView(Int32Array));
    public static u16: Mat4Ctor<Uint16Array> = getMat4Ctor(Uint16Array as any, NormalizedDataViewProvider.getView(Uint16Array));
    public static i16: Mat4Ctor<Int16Array> = getMat4Ctor(Int16Array as any, NormalizedDataViewProvider.getView(Int16Array));
    public static u8c: Mat4Ctor<Uint8ClampedArray> = getMat4Ctor(Uint8ClampedArray as any, NormalizedDataViewProvider.getView(Uint8ClampedArray));
    public static u8: Mat4Ctor<Uint8Array> = getMat4Ctor(Uint8Array as any, NormalizedDataViewProvider.getView(Uint8Array));
    public static i8: Mat4Ctor<Int8Array> = getMat4Ctor(Int8Array as any, NormalizedDataViewProvider.getView(Int8Array));

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


    public setIdentityMatrix(): Mat4<TArray>
    {
        throw new Error();
    }

    public getValueAt(_column: number, _row: number): number
    {
        throw new Error();
    }

    public getLoggableValue(): number[][]
    {
        throw new Error();
    }

    protected TTypeGuardMat4!: true;
    protected TTypeGuardTypedArray!: TArray;
}

/**
 * @public
 * Float32 {@link Mat4}.
 */
export type TMat4 = Mat4<Float32Array>;