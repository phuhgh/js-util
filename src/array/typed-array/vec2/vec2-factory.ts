import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { IVec2Ctor, TVec2CtorArgs, Vec2 } from "./vec2.js";
import { ATypedTupleFactory } from "../a-typed-tuple-factory.js";
import { TTypedArray } from "../t-typed-array.js";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view.js";
import { IEmscriptenWrapper } from "../../../web-assembly/emscripten/i-emscripten-wrapper.js";
import { EVectorIdentifier, type ISharedVectorBindings } from "../../../web-assembly/resizable-array/i-shared-vector-bindings.js";
import { getNumberIdentifier } from "../../../runtime/rtti-interop.js";
import type { IManagedResourceNode } from "../../../lifecycle/manged-resources.js";
import type { ITypedArrayTuple } from "../../../web-assembly/shared-array/typed-array-tuple.js";

export class Vec2Factory<T extends Vec2<TTypedArray>>
    extends ATypedTupleFactory<T, TVec2CtorArgs>
    implements ITypedArrayTupleFactory<T, TVec2CtorArgs>
{
    public constructor
    (
        private ctor: IVec2Ctor<TTypedArray>,
        dataView: INormalizedDataView,
    )
    {
        super(2, ctor.BYTES_PER_ELEMENT, dataView, getNumberIdentifier(ctor.BASE), EVectorIdentifier.Vec2);
    }

    public createShared
    (
        wrapper: IEmscriptenWrapper<ISharedVectorBindings>,
        owner: IManagedResourceNode | null,
    )
        : ITypedArrayTuple<T>
    {
        return ATypedTupleFactory.createSharedVector(wrapper, owner, this.ctor, this) as ITypedArrayTuple<T>;
    }

    public createOneEmpty(): T
    {
        return new this.ctor() as T;
    }

    public createOne
    (
        x: number,
        y: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = x;
        a[1] = y;

        return a;
    }

    public override copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = Vec2Factory.littleEndian,
    )
        : T
    {
        writeTo[0] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
        writeTo[1] = this.dataView.getValue(memoryDataView, pointer += this.bytesPerElement, littleEndian);

        return writeTo;
    }

    public override copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: Readonly<T>,
        pointer: number,
        littleEndian: boolean = Vec2Factory.littleEndian,
    )
        : void
    {
        this.dataView.setValue(memoryDataView, pointer, writeFrom[0], littleEndian);
        this.dataView.setValue(memoryDataView, pointer += this.bytesPerElement, writeFrom[1], littleEndian);
    }
}