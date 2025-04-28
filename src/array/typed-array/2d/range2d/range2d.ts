import { Mat2 } from "../../mat2/mat2.js";
import { TTypedArray } from "../../t-typed-array.js";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory.js";
import { getRange2dCtor } from "./get-range2d-ctor.js";
import { IReadonlyVec2, Vec2 } from "../../vec2/vec2.js";
import { IReadonlyMat3, Mat3 } from "../../mat3/mat3.js";
import { TTypedArrayCtor } from "../../t-typed-array-ctor.js";
import { TPickExcept } from "../../../../typescript/t-pick-except.js";
import { TTypedArrayTupleMutativeMethods } from "../../a-typed-array-tuple.js";
import { populateTypedArrayConstructorMap } from "../../../../runtime/rtti-interop.js";

/**
 * @public
 */
export type TRange2dCtorArgs = [xMin: number, yMin: number, xMax: number, yMax: number];

/**
 * @public
 * Constructor for {@link Range2d}.
 */
export interface IRange2dCtor<TArray extends TTypedArray>
{
    readonly BASE: TTypedArrayCtor;
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
 * {@link Range2d}.
 */
export interface IReadonlyRange2d<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Range2d<TArray>>,
        | "setXMin"
        | "setXMax"
        | "setYMin"
        | "setYMax"
        | "update"
        | "bound"
        | "ensureAABB"
        | "ensureMinRange"
        | "translateBy"
        | "copyFromBuffer"
        | TTypedArrayTupleMutativeMethods>
{
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
    public static f64: IRange2dCtor<Float64Array> = getRange2dCtor(Float64Array);
    public static f32: IRange2dCtor<Float32Array> = getRange2dCtor(Float32Array);
    public static u32: IRange2dCtor<Uint32Array> = getRange2dCtor(Uint32Array);
    public static i32: IRange2dCtor<Int32Array> = getRange2dCtor(Int32Array);
    public static u16: IRange2dCtor<Uint16Array> = getRange2dCtor(Uint16Array);
    public static i16: IRange2dCtor<Int16Array> = getRange2dCtor(Int16Array);
    public static u8c: IRange2dCtor<Uint8ClampedArray> = getRange2dCtor(Uint8ClampedArray);
    public static u8: IRange2dCtor<Uint8Array> = getRange2dCtor(Uint8Array);
    public static i8: IRange2dCtor<Int8Array> = getRange2dCtor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IRange2dCtor<InstanceType<TCtor>>
    {
        return Range2d.constructors.get(ctor) as IRange2dCtor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Range2d);

    public ["constructor"]!: IRange2dCtor<TArray>;

    /**
     * xMin
     */
    public 0!: number;
    /**
     * yMin
     */

    public 1!: number;

    /**
     * xMax
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

    public update(..._args: TRange2dCtorArgs): void
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

    public getXMaxAbs(): number
    {
        throw new Error();
    }

    public getYMaxAbs(): number
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
        _mat: IReadonlyMat3<TTypedArray>,
        _writeTo?: Range2d<TResult>,
    )
        : Range2d<TResult>
    {
        throw new Error();
    }

    public unionRange<TResult extends TTypedArray = TArray>
    (
        _range: IReadonlyRange2d<TTypedArray>,
        _writeTo?: Range2d<TResult>,
    )
        : Range2d<TResult>
    {
        throw new Error();
    }

    public extendRange<TResult extends TTypedArray = TArray>
    (
        _x: number,
        _y: number,
        _writeTo?: Range2d<TResult>,
    )
        : Range2d<TResult>
    {
        throw new Error();
    }

    /**
     * Creates a transform matrix that maps values in this range onto `_toRange`.
     */
    public getRangeTransform<TResult extends TTypedArray = TArray>
    (
        _toRange: IReadonlyRange2d<TTypedArray>,
        _result?: IReadonlyMat3<TResult>,
    )
        : Mat3<TResult>
    {
        throw new Error();
    }

    public isPointInRange(_point: IReadonlyVec2<TTypedArray>): boolean
    {
        throw new Error();
    }

    public doesRangeIntersect(_range: IReadonlyRange2d<TArray>): boolean
    {
        throw new Error();
    }

    public containsRange(_range: IReadonlyRange2d<TArray>): boolean
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
        _relativeTo: IReadonlyVec2<TTypedArray>,
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
    public bound(_boundTo: IReadonlyRange2d<TTypedArray>): void
    {
        throw new Error();
    }

    public ensureAABB(): boolean
    {
        throw new Error();
    }

    /**
     * Bound this range to be at least as large as the argument.
     *
     * @remarks
     * Where this range is smaller than the bounding range, it will be resized to be the minimum. This is done by adding
     * equally to both the min and max.
     */
    public ensureMinRange
    (
        _xMinRange: number,
        _yMinRange: number,
    )
        : void
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