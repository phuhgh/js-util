import { ITypedArrayCtor } from "../i-typed-array-ctor.js";
import { IVec4Ctor, Vec4 } from "./vec4.js";
import { Vec4Factory } from "./vec4-factory.js";
import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { RgbaColorPacker } from "../../../colors/rgba-color-packer.js";
import { TTypedArray } from "../t-typed-array.js";

/**
 * @internal
 */
export function getVec4Ctor<TCtor extends TTypedArrayCtor>
(
    ctor: TCtor
)
    : IVec4Ctor<InstanceType<TCtor>>
{
    return class Vec4Impl
        extends (ctor as unknown as ITypedArrayCtor<Vec4<InstanceType<TCtor>>>)
    {
        public static readonly BASE: TTypedArrayCtor = ctor;
        public static factory: Vec4Factory<Vec4<InstanceType<TCtor>>> = new Vec4Factory(Vec4Impl, NormalizedDataViewProvider.getView(ctor));
        public static readonly elementCount: number = 4;

        public ["constructor"]!: typeof Vec4Impl;

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 4,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public override isEqualTo(other: Vec4<TTypedArray>): boolean
        {
            return this[0] === other[0] && this[1] === other[1] && this[2] === other[2] && this[3] === other[3];
        }

        public override setRGBAColor(packedRGBA: number, normalize: boolean = false): Vec4<InstanceType<TCtor>>
        {
            if (normalize)
            {
                // 1 / 255
                this[0] = RgbaColorPacker.unpackR(packedRGBA) * 0.00392156862745098;
                this[1] = RgbaColorPacker.unpackG(packedRGBA) * 0.00392156862745098;
                this[2] = RgbaColorPacker.unpackB(packedRGBA) * 0.00392156862745098;
                this[3] = RgbaColorPacker.unpackA(packedRGBA) * 0.00392156862745098;
            }
            else
            {
                this[0] = RgbaColorPacker.unpackR(packedRGBA);
                this[1] = RgbaColorPacker.unpackG(packedRGBA);
                this[2] = RgbaColorPacker.unpackB(packedRGBA);
                this[3] = RgbaColorPacker.unpackA(packedRGBA);
            }

            return this;
        }

        /**
         * @param normalized - Is the data normalized (i.e. ranges from 0 - 1)? If so it will be multiplied up by 255.
         */
        public override getPackedRGBAColor(normalized: boolean = false): number
        {
            if (normalized)
            {
                return RgbaColorPacker.packColor(this[0] * 255, this[1] * 255, this[2] * 255, this[3] * 255);
            }
            else
            {
                return RgbaColorPacker.packColor(this[0], this[1], this[2], this[3]);
            }
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

        public override getW(): number
        {
            return this[3];
        }

        public override update(x: number, y: number, z: number, w: number): void
        {
            this[0] = x;
            this[1] = y;
            this[2] = z;
            this[3] = w;
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

        public override setW(w: number): void
        {
            this[3] = w;
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