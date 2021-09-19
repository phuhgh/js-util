import { IReadonlyRange2d, Range2d } from "../range2d/range2d";
import { TTypedArray } from "../../t-typed-array";
import { ITypedArrayTupleFactory } from "../../i-typed-array-tuple-factory";
import { getMargin2dCtor } from "./get-margin2d-ctor";
import { TTypedArrayCtor } from "../../t-typed-array-ctor";
import { populateTypedArrayConstructorMap } from "../../populate-typed-array-constructor-map";
import { Mat2 } from "../../mat2/mat2";
import { IReadonlyMat3 } from "../../mat3/mat3";
import { TPickExcept } from "../../../../typescript/t-pick-except";

/**
 * @public
 */
export type TMargin2dCtorArgs = [left: number, right: number, top: number, bottom: number];

/**
 * @public
 * Constructor for {@link Margin2d}.
 */
export interface IMargin2dCtor<TArray extends TTypedArray>
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
 * {@link Margin2d}.
 */
export interface IReadonlyMargin2d<TArray extends TTypedArray>
    extends TPickExcept<Readonly<Margin2d<TArray>>,
        | "setLeft"
        | "setRight"
        | "setTop"
        | "setBottom"
        | "update"
        | "copyFromBuffer">
{
}

/**
 * @public
 * 2x2 matrix representing margins on a rectangle.
 *
 * @remarks
 * See static properties for constructors. Instances are not an extension of this class, but of the static members.
 */
export abstract class Margin2d<TArray extends TTypedArray> extends Mat2<TArray>
{
    public static f64: IMargin2dCtor<Float64Array> = getMargin2dCtor(Float64Array);
    public static f32: IMargin2dCtor<Float32Array> = getMargin2dCtor(Float32Array);
    public static u32: IMargin2dCtor<Uint32Array> = getMargin2dCtor(Uint32Array);
    public static i32: IMargin2dCtor<Int32Array> = getMargin2dCtor(Int32Array);
    public static u16: IMargin2dCtor<Uint16Array> = getMargin2dCtor(Uint16Array);
    public static i16: IMargin2dCtor<Int16Array> = getMargin2dCtor(Int16Array);
    public static u8c: IMargin2dCtor<Uint8ClampedArray> = getMargin2dCtor(Uint8ClampedArray);
    public static u8: IMargin2dCtor<Uint8Array> = getMargin2dCtor(Uint8Array);
    public static i8: IMargin2dCtor<Int8Array> = getMargin2dCtor(Int8Array);

    public static getCtor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IMargin2dCtor<InstanceType<TCtor>>
    {
        return this.constructors.get(ctor) as IMargin2dCtor<InstanceType<TCtor>>;
    }

    protected static constructors = populateTypedArrayConstructorMap(Margin2d);

    public ["constructor"]: IMargin2dCtor<TArray>;

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

    public setLeft(_value: number): void
    {
        throw new Error();
    }

    public setRight(_value: number): void
    {
        throw new Error();
    }

    public setTop(_value: number): void
    {
        throw new Error();
    }

    public setBottom(_value: number): void
    {
        throw new Error();
    }

    public update(..._args: TMargin2dCtorArgs): void
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

    public getInnerRange<TResult extends TTypedArray = TArray>
    (
        _range: IReadonlyRange2d<TTypedArray>,
        _result?: Range2d<TResult>,
    )
        : Range2d<TResult>
    {
        throw new Error();
    }

    /**
     * Applies `Mat3.getTransformedXLength` `Mat3.getTransformedYLength` with a minimum of 0 and a maximum of
     * whatever the margin is.
     */
    public mat3TransformLength<TResult extends TTypedArray = TArray>
    (
        _mat: IReadonlyMat3<TTypedArray>,
        _writeTo?: Margin2d<TResult>,
    )
        : Margin2d<TResult>
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

    public TTypeGuardAMargin2d!: true;
}

/**
 * @public
 * Float32 {@link Margin2d}.
 */
export type TF32Margin2d = Margin2d<Float32Array>;

/**
 * @public
 * Float64 {@link Margin2d}.
 */
export type TF64Margin2d = Margin2d<Float64Array>;