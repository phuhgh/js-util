import { Vec2, Vec2Ctor } from "./vec2";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
const Vec2ByType = new Map<TTypedArrayCtor, Vec2Ctor<TTypedArray>>([
    [Float64Array, Vec2.f64],
    [Float32Array, Vec2.f32],
    [Uint32Array, Vec2.u32],
    [Int32Array, Vec2.i32],
    [Uint16Array, Vec2.u16],
    [Int16Array, Vec2.i16],
    [Uint8ClampedArray, Vec2.u8c],
    [Uint8Array, Vec2.u8],
    [Int8Array, Vec2.i8],
]);

/**
 * @internal
 */
export function getVec2Factory<TArrayCtor extends TTypedArrayCtor>(arrayCtor: TTypedArrayCtor): Vec2Ctor<InstanceType<TArrayCtor>>
{
    return Vec2ByType.get(arrayCtor) as Vec2Ctor<InstanceType<TArrayCtor>>;
}