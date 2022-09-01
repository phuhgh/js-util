import { TTypedArrayCtor } from "./t-typed-array-ctor.js";

/**
 * @internal
 */
export interface ITypedArrayConstructors
{
    f64: Function;
    f32: Function;
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
export function populateTypedArrayConstructorMap(constructors: ITypedArrayConstructors): Map<TTypedArrayCtor, Function>
{
    const m = new Map<TTypedArrayCtor, Function>();
    m.set(Float64Array, constructors.f64);
    m.set(Float32Array, constructors.f32);
    m.set(Int32Array, constructors.i32);
    m.set(Uint32Array, constructors.u32);
    m.set(Int16Array, constructors.i16);
    m.set(Uint16Array, constructors.u16);
    m.set(Int8Array, constructors.i8);
    m.set(Uint8Array, constructors.u8);
    m.set(Uint8ClampedArray, constructors.u8c);

    return m;
}