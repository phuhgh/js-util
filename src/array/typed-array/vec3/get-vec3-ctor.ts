import { ITypedArrayCtor } from "../i-typed-array-ctor.js";
import { IReadonlyVec3, IVec3Ctor, Vec3 } from "./vec3.js";
import { Vec3Factory } from "./vec3-factory.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { TTypedArray } from "../t-typed-array.js";

/**
 * @internal
 */
export function getVec3Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): IVec3Ctor<InstanceType<TCtor>>
{
    return class Vec3Impl extends (ctor as unknown as ITypedArrayCtor<Vec3<InstanceType<TCtor>>>)
    {
        public static factory: Vec3Factory<Vec3<InstanceType<TCtor>>> = new Vec3Factory(Vec3Impl, NormalizedDataViewProvider.getView(ctor));

        public ["constructor"]!: typeof Vec3Impl;

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 3,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override isEqualTo(other: Vec3<TTypedArray>): boolean
        {
            return this[0] === other[0] && this[1] === other[1] && this[2] === other[2];
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

        public override getMagnitude(): number
        {
            const x = this[0];
            const y = this[1];
            const z = this[2];
            return Math.sqrt(x * x + y * y + z * z);
        }

        public override getMagnitudeSquared(): number
        {
            const x = this[0];
            const y = this[1];
            const z = this[2];
            return x * x + y * y + z * z;
        }

        public override dotProduct
        (
            vec: IReadonlyVec3<TTypedArray>,
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

        public copyFromBuffer
        (
            memoryDataView: DataView,
            pointer: number,
            littleEndian?: boolean,
        )
            : void
        {
            this.constructor.factory.copyFromBuffer(memoryDataView, pointer, this, littleEndian);
        }

        public copyToBuffer
        (
            memoryDataView: DataView,
            pointer: number,
            littleEndian?: boolean,
        )
            : void
        {
            this.constructor.factory.copyToBuffer(memoryDataView, this, pointer, littleEndian);
        }

        public castToBaseType(): InstanceType<TCtor>
        {
            return this as InstanceType<TCtor>;
        }
    };
}