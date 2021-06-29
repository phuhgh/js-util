import { TTypedArray } from "../t-typed-array";
import { ITypedArrayCtor } from "../i-typed-array-ctor";
import { TVec4CtorArgs, Vec4, Vec4Ctor } from "./vec4";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view";
import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory";
import { Vec4Factory } from "./vec4-factory";

/**
 * @internal
 */
export function getVec4Ctor<TArray extends TTypedArray>(ctor: ITypedArrayCtor<Vec4<TArray>>, dataView: INormalizedDataView): Vec4Ctor<TArray>
{
    return class Vec4Impl extends ctor
    {
        public static factory: ITypedArrayTupleFactory<Vec4<TArray>, TVec4CtorArgs> = new Vec4Factory(Vec4Impl, dataView);

        public constructor
        (
            bufferOrLength: number | ArrayBufferLike = 4,
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