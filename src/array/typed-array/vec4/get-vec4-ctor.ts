import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { TVec4CtorArgs, Vec4, Vec4Ctor } from "./vec4";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec4Factory } from "./vec4-factory";
import { TTypedArrayCtor } from "../t-typed-array-ctor";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider";
import { RgbaColorPacker } from "../../../colors/rgba-color-packer";

/**
 * @internal
 */
export function getVec4Ctor<TCtor extends TTypedArrayCtor>(ctor: TCtor): Vec4Ctor<InstanceType<TCtor>>
{
    return class Vec4Impl extends (ctor as unknown as ITypedArrayCtor<Vec4<InstanceType<TCtor>>>)
    {
        public static factory: ITypedArrayTupleFactory<Vec4<InstanceType<TCtor>>, TVec4CtorArgs> = new Vec4Factory(Vec4Impl, NormalizedDataViewProvider.getView(ctor));

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 4,
            offset?: number,
            length?: number,
        )
        {
            super(bufferOrLength as ArrayBufferLike, offset, length);
        }

        public setRGBAColor(packedRGBA: number, normalize: boolean = false): Vec4<InstanceType<TCtor>>
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
    };
}