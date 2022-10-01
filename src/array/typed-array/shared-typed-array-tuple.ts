import { ISharedObject } from "../../lifecycle/i-shared-object.js";
import { TTypedArray } from "./t-typed-array.js";
import { ITypedArrayExtensions } from "./i-typed-array-extensions.js";
import { ITypedArrayCtor } from "./i-typed-array-ctor.js";
import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory.js";
import { ISharedMemoryBlock, SharedMemoryBlock } from "../../web-assembly/shared-memory/shared-memory-block.js";
import { isLittleEndian } from "../../web-assembly/util/is-little-endian.js";
import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper.js";
import { IMemoryUtilBindings } from "../../web-assembly/emscripten/i-memory-util-bindings.js";
import { IReferenceCountedPtr } from "../../web-assembly/util/reference-counted-ptr.js";
import { ATypedArrayTuple } from "./a-typed-array-tuple.js";
import { ILinkedReferences } from "../../lifecycle/linked-references.js";

/**
 * @public
 * Wrapper of block of memory that is the same size as `TArray`. Provides utility functions with stronger typing than
 * {@link ISharedMemoryBlock}.
 */
export interface ISharedTypedArrayTuple<TArray extends (ATypedArrayTuple<number, TTypedArray> & ITypedArrayExtensions)> extends ISharedObject
{
    memory: ISharedMemoryBlock;
    copyToBuffer(readFrom: TArray): void;
    copyFromBuffer(writeTo: TArray): void;
}


/**
 * @public
 */
export type TExtendedTypedArrayCtor<TArray extends ATypedArrayTuple<number, TTypedArray>> =
    ITypedArrayCtor<TArray>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    & { factory: ITypedArrayTupleFactory<any, any> }

/**
 @public
 {@inheritDoc ISharedTypedArrayTuple}
 */
export class SharedTypedArrayTuple<TArray extends (ATypedArrayTuple<number, TTypedArray> & ITypedArrayExtensions)> implements ISharedTypedArrayTuple<TArray>
{
    public static createOne<TArray extends (ATypedArrayTuple<number, TTypedArray> & ITypedArrayExtensions)>
    (
        typedArrayCtor: TExtendedTypedArrayCtor<TArray>,
        bindToReference: ILinkedReferences | null,
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
    )
        : ISharedTypedArrayTuple<TArray>
    {
        const byteSize = typedArrayCtor.BYTES_PER_ELEMENT * typedArrayCtor.factory.elementCount;
        const block = SharedMemoryBlock.createOne(wrapper, bindToReference, byteSize);

        return new SharedTypedArrayTuple<TArray>(block);
    }

    public sharedObject: IReferenceCountedPtr;

    public copyToBuffer(readFrom: TArray)
    {
        readFrom.copyToBuffer(this.memory.getDataView(), 0, SharedTypedArrayTuple.littleEndian);
    }

    public copyFromBuffer(writeTo: TArray)
    {
        writeTo.copyFromBuffer(this.memory.getDataView(), 0, SharedTypedArrayTuple.littleEndian);
    }

    private constructor
    (
        public readonly memory: ISharedMemoryBlock,
    )
    {
        this.sharedObject = memory.sharedObject;
    }

    private static littleEndian = isLittleEndian;
}