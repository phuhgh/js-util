import { Mat2 } from "../../mat2/mat2";
import { TTypedArray } from "../../t-typed-array";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { getRange2dCtor } from "./get-range2d-ctor";
import { Vec2 } from "../../vec2/vec2";
import { Mat3 } from "../../mat3/mat3";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../../populate-typed-array-constructor-map";

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
 * 2x2 matrix representing a 2d range.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Range2d<TArray extends TTypedArray> extends Mat2<TArray>
{
    public static f64: Range2dCtor<Float64Array> = getRange2dCtor(Float64Array);
    public static f32: Range2dCtor<Float32Array> = getRange2dCtor(Float32Array);
    public static u32: Range2dCtor<Uint32Array> = getRange2dCtor(Uint32Array);
    public static i32: Range2dCtor<Int32Array> = getRange2dCtor(Int32Array);
    public static u16: Range2dCtor<Uint16Array> = getRange2dCtor(Uint16Array);
    public static i16: Range2dCtor<Int16Array> = getRange2dCtor(Int16Array);
    public static u8c: Range2dCtor<Uint8ClampedArray> = getRange2dCtor(Uint8ClampedArray);
    public static u8: Range2dCtor<Uint8Array> = getRange2dCtor(Uint8Array);
    public static i8: Range2dCtor<Int8Array> = getRange2dCtor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Range2dCtor<InstanceType<TCtor>>
    {
        return Range2d.constructors.get(ctor) as Range2dCtor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Range2d);

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

    public getRange<TResult extends TTypedArray = TArray>
    (
        _result?: Vec2<TResult>,
    )
        : Vec2<TResult>
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

    public getCenter<TResult extends TTypedArray = TArray>
    (
        _result?: Vec2<TResult>
    )
        : Vec2<TResult>
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

    public mat3Multiply<TResult extends TTypedArray = TArray>
    (
        _mat: Readonly<Mat3<TTypedArray>>,
        _writeTo?: Range2d<TResult>,
    )
        : Range2d<TResult>
    {
        throw new Error();
    }

    public unionRange<TResult extends TTypedArray = TArray>
    (
        _range: Readonly<Range2d<TTypedArray>>,
        _writeTo?: Range2d<TResult>
    )
        : Range2d<TResult>
    {
        throw new Error();
    }

    public isPointInRange(_point: Vec2<TTypedArray>): boolean
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
        _relativeTo: Vec2<TTypedArray>,
        _result?: Range2d<TResult>,
    )
        : Range2d<TResult>
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
    public bound(_boundTo: Range2d<TTypedArray>): void
    {
        throw new Error();
    }

    /**
     * Shifts the range by (dx, dy).
     */
    public translateBy(_dx: number, _dy: number): void
    {
        throw new Error();
    }

    public TTypeGuardRange2d!: true;
}

/**
 * @public
 * Float32 {@link Range2d}.
 */
export type TF32Range2d = Range2d<Float32Array>;

/**
 * @public
 * Float64 {@link Range2d}.
 */
export type TF64Range2d = Range2d<Float64Array>;