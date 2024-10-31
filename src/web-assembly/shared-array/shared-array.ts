import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import { _Debug } from "../../debug/_debug.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { _Production } from "../../production/_production.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { ISharedArray } from "./i-shared-array.js";
import { ISharedArrayBindings } from "./i-shared-array-bindings.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { type ENumberIdentifier, getNumberIdentifier } from "../../array/typed-array/rtti-interop.js";
import type { IJsUtilBindings } from "../i-js-util-bindings.js";
import { type IManagedResourceNode, type IOnFreeListener, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";

/**
 * @public
 * Typed array shared between wasm and javascript.
 */
export class SharedArray<TCtor extends TTypedArrayCtor>
    implements ISharedArray<TCtor>
{
    /**
     * @throws exception if allocation cannot be performed.
     */
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings & IJsUtilBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
        clearMemory?: boolean,
    )
        : SharedArray<TCtor>
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings & IJsUtilBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
        clearMemory?: boolean,
        allocationFailThrows?: boolean,
    )
        : SharedArray<TCtor> | null
    public static createOne<TCtor extends TTypedArrayCtor>
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings & IJsUtilBindings>,
        containerType: TCtor,
        bindToReference: IManagedResourceNode | null,
        length: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : SharedArray<TCtor> | null
    {
        const numberId = getNumberIdentifier(containerType);
        const ptr = createSharedObject(wrapper, numberId, length, clearMemory, allocationFailThrows);
        return ptr === nullPtr ? null : new SharedArray(containerType, wrapper, bindToReference, numberId, length, ptr);
    }

    public readonly ctor: TCtor;
    public readonly numberId: ENumberIdentifier;
    public readonly length: number;
    public readonly elementByteSize: number;
    public readonly resourceHandle: IManagedResourceNode;
    public readonly pointer: number;


    public getInstance(): InstanceType<TCtor>
    {
        if (_BUILD.DEBUG)
        {
            _Debug.assert(!this.resourceHandle.getIsDestroyed(), "use after free");
            return this.impl.wrapper.debugUtils.protectedViews
                .getValue(this.resourceHandle)
                .createProtectedView(this.impl.instance);
        }
        else
        {
            return this.impl.instance;
        }
    }


    // @internal
    public constructor
    (
        ctor: TCtor,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings & IJsUtilBindings>,
        owner: IManagedResourceNode | null,
        numberId: ENumberIdentifier,
        length: number,
        pointer: number,
    )
    {
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.length = length;
        this.ctor = ctor;
        this.pointer = pointer;
        this.numberId = numberId;
        this.elementByteSize = ctor.BYTES_PER_ELEMENT;
        this.impl = new SharedArrayImpl(wrapper, ctor, pointer, numberId, length);
        const protectedView = _BUILD.DEBUG ? DebugProtectedView.createTypedArrayView() : null;
        wrapper.lifecycleStrategy.onSharedPointerCreated(this, new PointerDebugMetadata(this.pointer, true, "SharedArray"), protectedView);

        // configure listeners
        this.resourceHandle.onFreeChannel.addListener(this.impl);
        wrapper.memoryResize.addListener(this.impl);
    }

    private readonly impl: SharedArrayImpl<TCtor>;
    // @internal
    public debugOnAllocate?: (() => void);
}

class SharedArrayImpl<TCtor extends TTypedArrayCtor>
    implements IOnMemoryResize, IOnFreeListener
{
    public instance: InstanceType<TCtor>;

    public constructor
    (
        public readonly wrapper: IEmscriptenWrapper<ISharedArrayBindings & IJsUtilBindings>,
        public readonly ctor: TCtor,
        public readonly pointer: number,
        public readonly numberId: ENumberIdentifier,
        public readonly length: number,
    )
    {
        this.instance =this.createLocalInstance();
    }

    public onFree(): void
    {
        this.wrapper.memoryResize.removeListener(this);
        this.wrapper.instance._jsUtilDeleteObject(this.pointer);
    }

    public onMemoryResize(): void
    {
        this.instance = this.createLocalInstance();
    }

    public createLocalInstance(): InstanceType<TCtor>
    {
        const arrayPtr = this.wrapper.instance._sharedArray_getArrayAddress(this.numberId, this.pointer);
        _BUILD.DEBUG && _Debug.assert(arrayPtr !== nullPtr, "failed to get array address");

        return new this.ctor(this.wrapper.memory.buffer, arrayPtr, this.length) as InstanceType<TCtor>;
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
    const ptr = wrapper.instance._sharedArray_createOne(numberId, length, clearMemory);

    if (ptr === nullPtr && allocationFailThrows)
    {
        throw _Production.createError("Failed to allocate memory for shared array.");
    }

    return ptr;
}
