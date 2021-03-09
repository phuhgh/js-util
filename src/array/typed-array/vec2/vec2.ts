import { AVec2, TVec2F32 } from "./a-vec2";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import type { EArrayTypeGuard } from "../e-typed-array-guard";
import { Vec2F32Factory } from "./vec2-f32-factory";

/**
 * @public
 */
export type TVec2CtorArgs = [x: number, y: number];

/**
 * @public
 * Provider of typed array tuple {@link AVec2}. See static properties for factories and instance members for utilities.
 */
export class Vec2<TTypedArray>
{
    public static f32: Vec2<EArrayTypeGuard.F32> = new Vec2<EArrayTypeGuard.F32>(new Vec2F32Factory<TVec2F32>())

    protected constructor
    (
        public readonly factory: ITypedArrayTupleFactory<AVec2<TTypedArray>, TVec2CtorArgs>,
    )
    {
    }

    public getX(vec: AVec2<TTypedArray>): number
    {
        return vec[0];
    }

    public getY(vec: AVec2<TTypedArray>): number
    {
        return vec[1];
    }

    public setX(vec: AVec2<TTypedArray>, x: number): void
    {
        vec[0] = x;
    }

    public setY(vec: AVec2<TTypedArray>, y: number): void
    {
        vec[1] = y;
    }

    public add(a: AVec2<TTypedArray>, b: AVec2<TTypedArray>, result: AVec2<TTypedArray>): void
    {
        result[0] = a[0] + b[0];
        result[1] = a[1] + b[1];
    }

    public dotProduct
    (
        a: AVec2<TTypedArray>,
        b: AVec2<TTypedArray>,
        result: AVec2<TTypedArray> = this.factory.createOneEmpty(),
    )
        : AVec2<TTypedArray>
    {
        result[0] = a[0] * b[0];
        result[1] = a[1] * b[1];

        return result;
    }

    public getLoggableValue(value: AVec2<TTypedArray>): number[][]
    {
        return [
            [value[0], value[1]],
        ];
    }
}
