import { TTypedArray } from "../../t-typed-array";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { getRange1dCtor } from "./get-range1d-ctor";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../../populate-typed-array-constructor-map";
import { Vec2 } from "../vec2";
import { Mat2 } from "../../mat2/mat2";

/**
 * @public
 */
export type TRange1dCtorArgs = [min: number, max: number];

/**
 * @public
 * Constructor for {@link Range1d}.
 */
export interface Range1dCtor<TArray extends TTypedArray>
{
    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;
    readonly prototype: Range1d<TArray>;
    readonly factory: ITypedArrayTupleFactory<Range1d<TArray>, TRange1dCtorArgs>;
    new(): Range1d<TArray>;
}

/**
 * @public
 * Vec2 representing a 1d range.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Range1d<TArray extends TTypedArray> extends Vec2<TArray>
{
    public static f64: Range1dCtor<Float64Array> = getRange1dCtor(Float64Array);
    public static f32: Range1dCtor<Float32Array> = getRange1dCtor(Float32Array);
    public static u32: Range1dCtor<Uint32Array> = getRange1dCtor(Uint32Array);
    public static i32: Range1dCtor<Int32Array> = getRange1dCtor(Int32Array);
    public static u16: Range1dCtor<Uint16Array> = getRange1dCtor(Uint16Array);
    public static i16: Range1dCtor<Int16Array> = getRange1dCtor(Int16Array);
    public static u8c: Range1dCtor<Uint8ClampedArray> = getRange1dCtor(Uint8ClampedArray);
    public static u8: Range1dCtor<Uint8Array> = getRange1dCtor(Uint8Array);
    public static i8: Range1dCtor<Int8Array> = getRange1dCtor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Range1dCtor<InstanceType<TCtor>>
    {
        return Range1d.constructors.get(ctor) as Range1dCtor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Range1d);

    /**
     * min
     */
    public 0!: number;
    /**
     * max
     */
    public 1!: number;

    public setMin(_value: number): void
    {
        throw new Error();
    }

    public setMax(_value: number): void
    {
        throw new Error();
    }

    public getMin(): number
    {
        throw new Error();
    }

    public getMax(): number
    {
        throw new Error();
    }

    public getRange(): number
    {
        throw new Error();
    }

    public getCenter(): number
    {
        throw new Error();
    }

    public mat2Multiply<TResult extends TTypedArray = TArray>
    (
        _mat: Readonly<Mat2<TTypedArray>>,
        _writeTo?: Range1d<TResult>,
    )
        : Range1d<TResult>
    {
        throw new Error();
    }

    public unionRange<TResult extends TTypedArray = TArray>
    (
        _range: Readonly<Range1d<TTypedArray>>,
        _writeTo?: Range1d<TResult>
    )
        : Range1d<TResult>
    {
        throw new Error();
    }

    public isValueInRange1d(_value: number): boolean
    {
        throw new Error();
    }

    /* eslint-disable no-irregular-whitespace */
    /**
     * Scales the range relative to a point (may not be outside of the range).
     *
     * @remarks
     * If the point is at a boundary, then the range will be scaled such that that boundary is not changed. Where the
     * point is away from a boundary, the updated range will have boundaries proportional to the distance from the center
     * of the range.
     *
     * E.g. scaling factor of 0.5, P represents the position of the point in the range:
     *```
     * XMin                      XMax
     *  |P-------------------------|
     *  |-------------|
     *
     *  |------------P-------------|
     *        |-------------|
     *```
     */

    /* eslint-enable no-irregular-whitespace */
    public scaleRelativeTo<TResult extends TTypedArray = TArray>
    (
        _scalingFactor: number,
        _relativeTo: number,
        _result?: Range1d<TResult>,
    )
        : Range1d<TResult>
    {
        throw new Error();
    }

    /**
     * Bound this range to the argument.
     *
     * @remarks
     * Where this range is larger than the bounding range, it will be resized to fit.
     * Where this range is smaller than the bounding range but not contained, it will be moved maintaining its size. It
     * Will be moved such that the the side furthest from the bounding range will be at the edge of the boundary.
     */
    public bound1d(_boundTo: Range1d<TTypedArray>): void
    {
        throw new Error();
    }

    /**
     * Shifts the range by dv.
     */
    public translate1d(_dv: number): void
    {
        throw new Error();
    }

    public TTypeGuardRange1d!: true;
}

/**
 * @public
 * Float32 {@link Range1d}.
 */
export type TF32Range1d = Range1d<Float32Array>;

/**
 * @public
 * Float64 {@link Range1d}.
 */
export type TF64Range1d = Range1d<Float64Array>;