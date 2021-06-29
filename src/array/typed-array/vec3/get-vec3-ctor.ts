import { TTypedArray } from "../t-typed-array";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { TVec3CtorArgs, Vec3, Vec3Ctor } from "./vec3";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec3Factory } from "./vec3-factory";
import { Mat3 } from "../mat3/mat3";

/**
 * @internal
 */
export function getVec3Ctor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Vec3<TArray>>, dataView: INormalizedDataView): Vec3Ctor<TArray>
{
    return class Vec3Impl extends ctor
    {
        public static factory: ITypedArrayTupleFactory<Vec3<TArray>, TVec3CtorArgs> = new Vec3Factory(Vec3Impl, dataView);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 3,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override getX(): number
        {
            return this[0];
        }

        public override getY(): number
        {
            return this[1];
        }

        public override getZ(): number
        {
            return this[2];
        }

        public override update(x: number, y: number, z: number): void
        {
            this[0] = x;
            this[1] = y;
            this[2] = z;
        }

        public override setX(x: number): void
        {
            this[0] = x;
        }

        public override setY(y: number): void
        {
            this[1] = y;
        }

        public override setZ(z: number): void
        {
            this[2] = z;
        }

        public override getMat3MultiplyX(mat: Readonly<Mat3<TTypedArray>>): number
        {
            return mat[0] * this[0] + mat[3] * this[0] + mat[6];
        }

        public override getMat3MultiplyY(mat: Readonly<Mat3<TTypedArray>>): number
        {
            return mat[1] * this[1] + mat[4] * this[1] + mat[7];
        }

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1], this[2]],
            ];
        }
    };
}