import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { _Production } from "../../production/_production.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { ISharedArray } from "./i-shared-array.js";
import { ISharedArrayBindings } from "./i-shared-array-bindings.js";
import { bufferCategory, type ENumberIdentifier, getNumberIdentifier, getNumberSpecialization, IdSpecialization } from "../../runtime/rtti-interop.js";
import { type IManagedResourceNode, type IOnFreeListener } from "../../lifecycle/manged-resources.js";
import { SharedBufferView } from "../shared-memory/shared-buffer-view.js";

/**
 * @public
 */
export const sharedArraySpecialization = new IdSpecialization(bufferCategory, "JSU_SHARED_ARRAY");

/**
 * @public
 * Typed array shared between wasm and javascript.
 */
export class SharedArray<TCtor extends TTypedArrayCtor>
    extends SharedBufferView<TCtor>
    implements ISharedArray<TCtor>
{
    /**
     * @throws exception if allocation cannot be performed.
     */
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
        clearMemory?: boolean,
    )
        : SharedArray<TCtor>
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
        clearMemory?: boolean,
        allocationFailThrows?: boolean,
    )
        : SharedArray<TCtor> | null
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : SharedArray<TCtor> | null
    {
        const numberId = getNumberIdentifier(containerType);
        const pointer = createSharedObject(wrapper, numberId, length, clearMemory, allocationFailThrows);
        return pointer === nullPtr ? null : new SharedArray(containerType, wrapper, bindToReference, length, pointer, numberId);
    }

    public readonly length: number;
    public readonly pointer: number;

    public getWrapper(): IEmscriptenWrapper<ISharedArrayBindings>
    {
        return this.localImpl.wrapper;
    }

    // @internal
    public constructor
    (
        ctor: TCtor,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        owner: IManagedResourceNode | null,
        length: number,
        pointer: number,
        numberId: ENumberIdentifier,
    )
    {
        super(wrapper, owner, ctor, wrapper.instance._sharedArray_getDataAddress(numberId, pointer), length * ctor.BYTES_PER_ELEMENT);
        this.length = length;
        this.pointer = pointer;
        this.localImpl = new SharedArrayImpl(wrapper, pointer);

        // annotations
        wrapper.interopIds.setSpecializations(this, [sharedArraySpecialization, getNumberSpecialization(ctor)]);

        // configure listeners
        this.resourceHandle.onFreeChannel.addListener(this.localImpl);
    }

    private readonly localImpl: SharedArrayImpl;
    // @internal
    public debugOnAllocate?: (() => void);
}

class SharedArrayImpl implements IOnFreeListener
{

    public constructor
    (
        public readonly wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        public readonly owningPointer: number,
    )
    {
    }

    public onFree(): void
    {
        this.wrapper.instance._jsUtilDeleteObject(this.owningPointer);
    }
}

function createSharedObject
(
    wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
    numberId: ENumberIdentifier,
    length: number,
    clearMemory: boolean,
    allocationFailThrows: boolean,
)
    : number
{
    const pointer = wrapper.instance._sharedArray_createOne(numberId, length, clearMemory);

    if (pointer === nullPtr && allocationFailThrows)
    {
        // todo jack: extensible error here?
        throw _Production.createError("Failed to allocate memory for shared array.");
    }

    return pointer;
}
