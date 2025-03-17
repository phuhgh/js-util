import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { ISharedArray } from "./i-shared-array.js";
import { ISharedArrayBindings } from "./i-shared-array-bindings.js";
import { bufferCategory, type ENumberIdentifier, getNumberIdentifier, getNumberSpecialization, IdSpecialization } from "../../runtime/rtti-interop.js";
import { type IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import { SharedBufferView } from "../shared-memory/shared-buffer-view.js";
import { NestedError } from "../../error-handling/nested-error.js";
import { WasmErrorCause } from "../wasm-error-cause.js";
import { ESharedObjectOwnerKind, SharedObjectCleanup } from "../shared-memory/shared-object-cleanup.js";

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
        const pointerToContainer = createSharedObject(wrapper, numberId, length, clearMemory, allocationFailThrows);
        return pointerToContainer === nullPtr ? null : new SharedArray(containerType, wrapper, bindToReference, length, pointerToContainer, numberId);
    }

    public readonly length: number;
    public readonly pointer: number;

    public getWrapper(): IEmscriptenWrapper<ISharedArrayBindings>
    {
        return this.wrapper as IEmscriptenWrapper<ISharedArrayBindings>;
    }

    // @internal
    public constructor
    (
        ctor: TCtor,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        owner: IManagedResourceNode | null,
        length: number,
        pointerToContainer: number,
        numberId: ENumberIdentifier,
    )
    {
        super(wrapper, owner, ctor, wrapper.instance._sharedArray_getDataAddress(numberId, pointerToContainer), length * ctor.BYTES_PER_ELEMENT);
        this.length = length;
        this.pointer = pointerToContainer;
        this.cleanup = new SharedObjectCleanup(this, ESharedObjectOwnerKind.SharedMemoryOwner);
        SharedObjectCleanup.registerCleanup(this, this.cleanup, new SharedObjectCleanup.Options("SharedArray", null, ESharedObjectOwnerKind.SharedMemoryOwner));

        // annotations
        wrapper.interopIds.setSpecializations(this, [sharedArraySpecialization, getNumberSpecialization(ctor)]);
    }

    // @internal
    public debugOnAllocate?: (() => void);
    private readonly cleanup: SharedObjectCleanup;
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
        throw new NestedError("Failed to allocate memory for shared array.", WasmErrorCause.allocationFailure);
    }

    return pointer;
}
