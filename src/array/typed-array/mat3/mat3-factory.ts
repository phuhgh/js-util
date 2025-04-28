import { ITypedArrayTupleFactory } from "../i-typed-array-tuple-factory.js";
import { ATypedTupleFactory } from "../a-typed-tuple-factory.js";
import { TTypedArray } from "../t-typed-array.js";
import { IMat3Ctor, Mat3, TMat3CtorArgs } from "./mat3.js";
import { INormalizedDataView } from "../normalized-data-view/i-normalized-data-view.js";
import { getNumberIdentifier } from "../../../runtime/rtti-interop.js";
import { EVectorIdentifier, type ISharedVectorBindings } from "../../../web-assembly/resizable-array/i-shared-vector-bindings.js";
import { IEmscriptenWrapper } from "../../../web-assembly/emscripten/i-emscripten-wrapper.js";
import type { IManagedResourceNode } from "../../../lifecycle/manged-resources.js";
import type { ITypedArrayTuple } from "../../../web-assembly/shared-array/typed-array-tuple.js";

export class Mat3Factory<T extends Mat3<TTypedArray>>
    extends ATypedTupleFactory<T, TMat3CtorArgs>
    implements ITypedArrayTupleFactory<T, TMat3CtorArgs>
{
    public constructor
    (
        private ctor: IMat3Ctor<TTypedArray>,
        dataView: INormalizedDataView,
    )
    {
        super(9, ctor.BYTES_PER_ELEMENT, dataView, getNumberIdentifier(ctor.BASE), EVectorIdentifier.Mat3);
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
        c1r1: number,
        c2r1: number,
        c3r1: number,
        c1r2: number,
        c2r2: number,
        c3r2: number,
        c1r3: number,
        c2r3: number,
        c3r3: number,
    )
        : T
    {
        const a = this.createOneEmpty();
        a[0] = c1r1;
        a[1] = c2r1;
        a[2] = c3r1;
        a[3] = c1r2;
        a[4] = c2r2;
        a[5] = c3r2;
        a[6] = c1r3;
        a[7] = c2r3;
        a[8] = c3r3;

        return a;
    }
}