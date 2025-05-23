import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { bufferCategory, type ENumberIdentifier, getNumberIdentifier, getNumberSpecialization, IdSpecialization } from "../../runtime/rtti-interop.js";
import type { IJsUtilBindings } from "../i-js-util-bindings.js";
import { type IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import { SharedBufferView } from "../shared-memory/shared-buffer-view.js";
import type { ISharedArray } from "../shared-array/i-shared-array.js";
import type { IResizableArrayBindings } from "./i-resizable-array-bindings.js";
import { NestedError } from "../../error-handling/nested-error.js";
import { WasmErrorCause } from "../wasm-error-cause.js";
import { ESharedObjectOwnerKind, SharedObjectCleanup } from "../shared-memory/shared-object-cleanup.js";

/**
 * @public
 */
export const resizableArraySpecialization = new IdSpecialization(bufferCategory, "JSU_RESIZABLE_ARRAY");

/**
 * @public
 * Typed array shared between wasm and javascript, unlike {@link SharedArray}, resizing is possible.
 */
export class ResizableArray<TCtor extends TTypedArrayCtor>
    extends SharedBufferView<TCtor>
    implements ISharedArray<TCtor>
{
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<IResizableArrayBindings & IJsUtilBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
    )
    {
        const numberId = getNumberIdentifier(containerType);
        const sharedObject = createSharedObject(wrapper, numberId, length, true);
        return new ResizableArray(wrapper, containerType, bindToReference, length, sharedObject, numberId);
    }

    public readonly length: number;
    public readonly pointer: number;

    // @internal
    public constructor
    (
        wrapper: IEmscriptenWrapper<IResizableArrayBindings & IJsUtilBindings>,
        ctor: TCtor,
        owner: IManagedResourceNode | null,
        length: number,
        pointer: number,
        numberId: ENumberIdentifier,
    )
    {
        super(wrapper, owner, ctor, wrapper.instance._resizableArray_getDataAddress(numberId, pointer), length * ctor.BYTES_PER_ELEMENT);
        this.length = length;
        this.pointer = pointer;
        this.cleanup = new SharedObjectCleanup(this, ESharedObjectOwnerKind.SharedMemoryOwner);
        SharedObjectCleanup.registerCleanup(this, this.cleanup, new SharedObjectCleanup.Options("ResizableArray", null, ESharedObjectOwnerKind.SharedMemoryOwner));

        // annotations
        wrapper.interopIds.setSpecializations(this, [resizableArraySpecialization, getNumberSpecialization(ctor)]);
    }

    // @internal
    public debugOnAllocate?: (() => void);
    private readonly cleanup: SharedObjectCleanup;
}


function createSharedObject
(
    wrapper: IEmscriptenWrapper<IResizableArrayBindings>,
    numberId: ENumberIdentifier,
    length: number,
    allocationFailThrows: boolean,
)
    : number
{
    const ptr = wrapper.instance._resizableArray_createOne(numberId, length);

    if (ptr === nullPtr && allocationFailThrows)
    {
        throw new NestedError("Failed to allocate memory for resizable array.", WasmErrorCause.allocationFailure);
    }

    return ptr;
}
