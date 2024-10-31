import { type TFullSetTypedArrayCtor } from "./t-typed-array-ctor.js";

/**
 * @public
 * Matches ENumberIdentifier in `RTTI.hpp`.
 */
export enum ENumberIdentifier
{
    U8 = 1,
    U16,
    U32,
    U64,
    I8,
    I16,
    I32,
    I64,
    F32,
    F64,
}

/**
 * @public
 * Given a typed array constructor, get the identifier which matches up with ENumberIdentifier in `RTTI.hpp`.
 */
export function getNumberIdentifier(ctor: TFullSetTypedArrayCtor): ENumberIdentifier
{
    return numberMapping.get(ctor)!;
}

const numberMapping = new Map<TFullSetTypedArrayCtor, ENumberIdentifier>([
    [Uint8Array as TFullSetTypedArrayCtor, ENumberIdentifier.U8],
    [Uint16Array as TFullSetTypedArrayCtor, ENumberIdentifier.U16],
    [Uint32Array as TFullSetTypedArrayCtor, ENumberIdentifier.U32],
    [BigUint64Array as TFullSetTypedArrayCtor, ENumberIdentifier.U64],
    [Int8Array as TFullSetTypedArrayCtor, ENumberIdentifier.I8],
    [Int16Array as TFullSetTypedArrayCtor, ENumberIdentifier.I16],
    [Int32Array as TFullSetTypedArrayCtor, ENumberIdentifier.I32],
    [BigInt64Array as TFullSetTypedArrayCtor, ENumberIdentifier.I64],
    [Float32Array as TFullSetTypedArrayCtor, ENumberIdentifier.F32],
    [Float64Array as TFullSetTypedArrayCtor, ENumberIdentifier.F64],
]);

/**
 * @internal
 */
export interface ITypedArrayConstructors
{
    f64: Function;
    f32: Function;
    i64: Function | null; // indicates not supported
    u64: Function | null; // indicates not supported
    u32: Function;
    i32: Function;
    u16: Function;
    i16: Function;
    u8c: Function;
    u8: Function;
    i8: Function;
}

/**
 * @internal
 */
export function populateTypedArrayConstructorMap(constructors: ITypedArrayConstructors): Map<TFullSetTypedArrayCtor, Function>
{
    const m = new Map<TFullSetTypedArrayCtor, Function>();
    m.set(Float64Array, constructors.f64);
    m.set(Float32Array, constructors.f32);
    if (constructors.i64 != null)
    {
        m.set(BigInt64Array, constructors.i64);
    }
    if (constructors.u64 != null)
    {
        m.set(BigUint64Array, constructors.u64);
    }
    m.set(Int32Array, constructors.i32);
    m.set(Uint32Array, constructors.u32);
    m.set(Int16Array, constructors.i16);
    m.set(Uint16Array, constructors.u16);
    m.set(Int8Array, constructors.i8);
    m.set(Uint8Array, constructors.u8);
    m.set(Uint8ClampedArray, constructors.u8c);

    return m;
}