import { Mat2 } from "../../mat2/mat2";
import { TTypedArray } from "../../t-typed-array";
import { NormalizedDataViewProvider } from "../../normalized-data-view/normalized-data-view-provider";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { getRange2dCtor } from "./get-range2d-ctor";
import { Vec2 } from "../../vec2/vec2";

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @public
 */
export type TRange2dCtorArgs = [xMin: number, xMax: number, yMin: number, yMax: number];

/**
 * @public
 * Constructor for {@link Range2d}.
 */
export interface Range2dCtor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Range2d<TArray>;
    readonly factory: ITypedArrayTupleFactory<Range2d<TArray>, TRange2dCtorArgs>;
    new(): Range2d<TArray>;
}

/**
 * @public
 * Row major 2x2 matrix representing a 2d range.
 *
 * @remarks
 * See static properties for factories.
 */
export abstract class Range2d<TArray extends TTypedArray> extends Mat2<TArray>
{
    public static f64: Range2dCtor<Float64Array> = getRange2dCtor(Float64Array as any, NormalizedDataViewProvider.getView(Float64Array));
    public static f32: Range2dCtor<Float32Array> = getRange2dCtor(Float32Array as any, NormalizedDataViewProvider.getView(Float32Array));
    public static u32: Range2dCtor<Uint32Array> = getRange2dCtor(Uint32Array as any, NormalizedDataViewProvider.getView(Uint32Array));
    public static i32: Range2dCtor<Int32Array> = getRange2dCtor(Int32Array as any, NormalizedDataViewProvider.getView(Int32Array));
    public static u16: Range2dCtor<Uint16Array> = getRange2dCtor(Uint16Array as any, NormalizedDataViewProvider.getView(Uint16Array));
    public static i16: Range2dCtor<Int16Array> = getRange2dCtor(Int16Array as any, NormalizedDataViewProvider.getView(Int16Array));
    public static u8c: Range2dCtor<Uint8ClampedArray> = getRange2dCtor(Uint8ClampedArray as any, NormalizedDataViewProvider.getView(Uint8ClampedArray));
    public static u8: Range2dCtor<Uint8Array> = getRange2dCtor(Uint8Array as any, NormalizedDataViewProvider.getView(Uint8Array));
    public static i8: Range2dCtor<Int8Array> = getRange2dCtor(Int8Array as any, NormalizedDataViewProvider.getView(Int8Array));

    /**
     * xMin
     */
    public 0!: number;
    /**
     * xMax
     */
    public 1!: number;
    /**
     * yMin
     */
    public 2!: number;
    /**
     * yMax
     */
    public 3!: number;

    public setXMin(_value: number): void
    {
        throw new Error();
    }

    public setXMax(_value: number): void
    {
        throw new Error();
    }

    public setYMin(_value: number): void
    {
        throw new Error();
    }

    public setYMax(_value: number): void
    {
        throw new Error();
    }

    public getXMin(): number
    {
        throw new Error();
    }

    public getXMax(): number
    {
        throw new Error();
    }

    public getYMin(): number
    {
        throw new Error();
    }

    public getYMax(): number
    {
        throw new Error();
    }

    public getXRange(): number
    {
        throw new Error();
    }

    public getYRange(): number
    {
        throw new Error();
    }

    public getXCenter(): number
    {
        throw new Error();
    }

    public getYCenter(): number
    {
        throw new Error();
    }

    public getXSum(): number
    {
        throw new Error();
    }

    public getYSum(): number
    {
        throw new Error();
    }

    public unionRange(_range: Readonly<Range2d<TArray>>, _writeTo?: Range2d<TArray>): Range2d<TArray>
    {
        throw new Error();
    }

    public isPointInRange(_point: Vec2<TArray>): boolean
    {
        throw new Error();
    }

    public TTypeGuardRange2d!: true;
}

/**
 * @public
 * A float32 {@link Range2d}.
 */
export type TF32Range2d = Range2d<Float32Array>;