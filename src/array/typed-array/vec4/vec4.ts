import { AVec4, TVec4F32 } from "./a-vec4";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec4F32Factory } from "./vec4-f32-factory";
import type { EArrayTypeGuard } from "../e-typed-array-guard";

/**
 * @public
 */
export type TVec4CtorArgs = [x: number, y: number, z: number, w: number];

/**
 * @public
 * Provider of typed array tuple {@link AVec4}. See static properties for factories and instance members for utilities.
 */
export class Vec4<TTypedArray extends EArrayTypeGuard>
{
    public static f32: Vec4<EArrayTypeGuard.F32> = new Vec4<EArrayTypeGuard.F32>(new Vec4F32Factory<TVec4F32>());

    protected constructor
    (
        public readonly factory: ITypedArrayTupleFactory<AVec4<TTypedArray>, TVec4CtorArgs>,
    )
    {
    }

    public getX(vec: Readonly<AVec4<TTypedArray>>): number
    {
        return vec[0];
    }

    public getY(vec: Readonly<AVec4<TTypedArray>>): number
    {
        return vec[1];
    }

    public getZ(vec: Readonly<AVec4<TTypedArray>>): number
    {
        return vec[2];
    }

    public getW(vec: Readonly<AVec4<TTypedArray>>): number
    {
        return vec[3];
    }

    public update(vec: AVec4<TTypedArray>, x: number, y: number, z: number, w: number): void
    {
        vec[0] = x;
        vec[1] = y;
        vec[2] = z;
        vec[3] = w;
    }

    public setX(vec: AVec4<TTypedArray>, x: number): void
    {
        vec[0] = x;
    }

    public setY(vec: AVec4<TTypedArray>, y: number): void
    {
        vec[1] = y;
    }

    public setZ(vec: AVec4<TTypedArray>, z: number): void
    {
        vec[2] = z;
    }

    public setW(vec: AVec4<TTypedArray>, w: number): void
    {
        vec[3] = w;
    }

    public getLoggableValue(value: Readonly<AVec4<TTypedArray>>): number[][]
    {
        return [
            [value[0], value[1], value[2]],
        ];
    }
}
