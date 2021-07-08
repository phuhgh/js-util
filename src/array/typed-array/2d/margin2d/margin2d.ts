import { Range2d } from "../range2d/range2d";
import { TTypedArray } from "../../t-typed-array";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { getMargin2dCtor } from "./get-margin2d-ctor";

/**
 * @public
 */
export type TMargin2dCtorArgs = [left: number, right: number, top: number, bottom: number];

/**
 * @public
 * Constructor for {@link Margin2d}.
 */
export interface Margin2dCtor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Margin2d<TArray>;
    readonly factory: ITypedArrayTupleFactory<Margin2d<TArray>, TMargin2dCtorArgs>;
    new(): Margin2d<TArray>;
}

/**
 * @public
 * Row major 2x2 matrix representing margins on a rectangle.
 *
 * @remarks
 * See static properties for factories.
 */
export abstract class Margin2d<TArray extends TTypedArray> extends Range2d<TArray>
{
    public static f64: Margin2dCtor<Float64Array> = getMargin2dCtor(Float64Array);
    public static f32: Margin2dCtor<Float32Array> = getMargin2dCtor(Float32Array);
    public static u32: Margin2dCtor<Uint32Array> = getMargin2dCtor(Uint32Array);
    public static i32: Margin2dCtor<Int32Array> = getMargin2dCtor(Int32Array);
    public static u16: Margin2dCtor<Uint16Array> = getMargin2dCtor(Uint16Array);
    public static i16: Margin2dCtor<Int16Array> = getMargin2dCtor(Int16Array);
    public static u8c: Margin2dCtor<Uint8ClampedArray> = getMargin2dCtor(Uint8ClampedArray);
    public static u8: Margin2dCtor<Uint8Array> = getMargin2dCtor(Uint8Array);
    public static i8: Margin2dCtor<Int8Array> = getMargin2dCtor(Int8Array);

    /**
     * left
     */
    public 0!: number;
    /**
     * right
     */
    public 1!: number;
    /**
     * top
     */
    public 2!: number;
    /**
     * bottom
     */
    public 3!: number;

    public getLeft(): number
    {
        throw new Error();
    }

    public getRight(): number
    {
        throw new Error();
    }

    public getTop(): number
    {
        throw new Error();
    }

    public getBottom(): number
    {
        throw new Error();
    }

    public sumX(): number
    {
        throw new Error();
    }

    public sumY(): number
    {
        throw new Error();
    }

    public getInnerRange(_range: Readonly<Range2d<TArray>>, _result?: Range2d<TArray>): Range2d<TArray>
    {
        throw new Error();
    }

    public TTypeGuardAMargin2d!: true;
}

/**
 * @public
 * Float32 {@link Margin2d}.
 */
export type TF32Margin2d = Margin2d<Float32Array>;