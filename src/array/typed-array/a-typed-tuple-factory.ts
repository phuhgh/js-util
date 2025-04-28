import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory.js";
import { INormalizedDataView } from "./normalized-data-view/i-normalized-data-view.js";
import { ATypedArrayTuple } from "./a-typed-array-tuple.js";
import { TTypedArray } from "./t-typed-array.js";
import { isLittleEndian } from "../../web-assembly/util/is-little-endian.js";
import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { EVectorIdentifier, ISharedVectorBindings } from "../../web-assembly/resizable-array/i-shared-vector-bindings.js";
import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper.js";
import type { IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import { nullPtr } from "../../web-assembly/emscripten/null-pointer.js";
import { NestedError } from "../../error-handling/nested-error.js";
import { WasmErrorCause } from "../../web-assembly/wasm-error-cause.js";
import { type ITypedArrayTuple, TypedArrayTuple } from "../../web-assembly/shared-array/typed-array-tuple.js";

export abstract class ATypedTupleFactory<TArray extends ATypedArrayTuple<number, TTypedArray>, TCtorArgs extends number[]>
    implements ITypedArrayTupleFactory<TArray, TCtorArgs>
{
    public readonly byteSize: number;

    protected constructor
    (
        public readonly elementCount: number,
        protected readonly bytesPerElement: number,
        protected dataView: INormalizedDataView,
        public readonly numberId: ENumberIdentifier,
        public readonly vectorId: EVectorIdentifier,
    )
    {
        this.byteSize = elementCount * bytesPerElement;
    }

    public abstract createShared(wrapper: IEmscriptenWrapper<ISharedVectorBindings>, owner: IManagedResourceNode | null): ITypedArrayTuple<TArray>;

    public abstract createOne(...args: TCtorArgs): TArray;

    public abstract createOneEmpty(): TArray;

    public copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: TArray = this.createOneEmpty(),
        littleEndian: boolean = ATypedTupleFactory.littleEndian,
    )
        : TArray
    {
        const bytesPerElement = this.bytesPerElement;

        for (let i = 0, iEnd = this.elementCount; i < iEnd; ++i)
        {
            (writeTo as unknown as number[])[i] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
            pointer += bytesPerElement;
        }

        return writeTo;
    }

    public copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: Readonly<TArray>,
        pointer: number,
        littleEndian: boolean = ATypedTupleFactory.littleEndian,
    )
        : void
    {
        const bytesPerElement = this.bytesPerElement;

        for (let i = 0, iEnd = this.elementCount; i < iEnd; ++i)
        {
            this.dataView.setValue(memoryDataView, pointer, (writeFrom as unknown as number[])[i], littleEndian);
            pointer += bytesPerElement;
        }
    }

    protected static createSharedVector<TArray extends ATypedArrayTuple<number, TTypedArray>>
    (
        wrapper: IEmscriptenWrapper<ISharedVectorBindings>,
        owner: IManagedResourceNode | null,
        ctor: new (buffer: ArrayBufferLike, offset: number, byteSize: number) => TArray,
        bufferFactory: ITypedArrayTupleFactory<ATypedArrayTuple<number, TTypedArray>, number[]>,
    )
        : ITypedArrayTuple<TArray>
    {
        const ptr = wrapper.instance._jsUtilCreateVec(bufferFactory.numberId, bufferFactory.vectorId);

        if (ptr == nullPtr)
        {
            throw new NestedError("Failed to allocate memory for shared tuple.", WasmErrorCause.allocationFailure);
        }

        return new TypedArrayTuple(wrapper, owner, ctor, ptr, bufferFactory.numberId, bufferFactory.byteSize);
    }

    protected static littleEndian = isLittleEndian;
}
