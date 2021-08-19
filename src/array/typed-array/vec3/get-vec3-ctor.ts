import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { IVec3Ctor, TVec3CtorArgs, Vec3 } from "./vec3";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec3Factory } from "./vec3-factory";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { TTypedArray } from "../t-typed-array";

/**
 * @internal
 */
export function getVec3Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IVec3Ctor<InstanceType<TCtor>>
{
    return class Vec3Impl extends (ctor as unknown as ITypedArrayCtor<Vec3<InstanceType<TCtor>>>)
    {
        public static factory: ITypedArrayTupleFactory<Vec3<InstanceType<TCtor>>, TVec3CtorArgs> = new Vec3Factory(Vec3Impl, NormalizedDataViewProvider.getView(ctor));

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

        public getMagnitude(): number
        {
            const x = this[0];
            const y = this[1];
            const z = this[2];
            return Math.sqrt(x * x + y * y + z * z);
        }

        public getMagnitudeSquared(): number
        {
            const x = this[0];
            const y = this[1];
            const z = this[2];
            return x * x + y * y + z * z;
        }

        public override dotProduct
        (
            vec: Readonly<Vec3<TTypedArray>>,
        )
            : number
        {
            return this[0] * vec[0] + this[1] * vec[1] + this[2] * vec[2];
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

        public override getLoggableValue(): number[][]
        {
            return [
                [this[0], this[1], this[2]],
            ];
        }
    };
}