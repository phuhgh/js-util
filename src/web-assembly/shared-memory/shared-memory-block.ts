import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { _Debug } from "../../debug/_debug.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { type IManagedObject, type IManagedResourceNode, type IOnFreeListener } from "../../lifecycle/manged-resources.js";
import type { IInteropBindings } from "../emscripten/i-interop-bindings.js";
import { NestedError } from "../../error-handling/nested-error.js";
import { WasmErrorCause } from "../wasm-error-cause.js";
import { ESharedObjectOwnerKind, SharedObjectCleanup } from "./shared-object-cleanup.js";

/**
 * @public
 * Provides a reference counted wrapper to a pointer `malloc`'d from JS and is `free`'d on reference count hitting 0.
 */
export interface ISharedMemoryBlock
    extends IManagedObject
{
    readonly pointer: number;
    readonly byteSize: number;
    getDataView(): DataView;
}

/**
 * @public
 * {@inheritDoc ISharedMemoryBlock}
 */
export class SharedMemoryBlock
    implements ISharedMemoryBlock
{
    public readonly resourceHandle: IManagedResourceNode;
    public readonly pointer: number;
    public readonly byteSize: number;

    /**
     * @throws exception if allocation cannot be performed.
     */
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IInteropBindings>,
        bindToReference: IManagedResourceNode | null,
        byteSize: number,
    )
        : SharedMemoryBlock
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IInteropBindings>,
        bindToReference: IManagedResourceNode | null,
        byteSize: number,
        allocationFailThrows: boolean,
    )
        : SharedMemoryBlock | null
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IInteropBindings>,
        bindToReference: IManagedResourceNode | null,
        byteSize: number,
        allocationFailThrows: boolean = true,
    )
        : SharedMemoryBlock | null
    {
        _BUILD.DEBUG && wrapper.debugUtils.onAllocate.emit();
        const pointer = wrapper.instance._jsUtilMalloc(byteSize);

        if (pointer == nullPtr)
        {
            if (allocationFailThrows)
            {
                throw new NestedError("Failed to allocate memory for shared memory block.", WasmErrorCause.allocationFailure);
            }
            else
            {
                return null;
            }
        }

        return new SharedMemoryBlock(wrapper, bindToReference, pointer, byteSize);
    }

    public getWrapper(): IEmscriptenWrapper<IInteropBindings>
    {
        return this.wrapper;
    }

    public getDataView(): DataView
    {
        if (_BUILD.DEBUG)
        {
            _Debug.assert(!this.resourceHandle.getIsDestroyed(), "use after free");
            return this.wrapper.debugUtils.protectedViews
                .getValue(this.resourceHandle)
                .createProtectedView(this.impl.dataView);
        }
        else
        {
            return this.impl.dataView;
        }
    }

    protected constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IInteropBindings>,
        owner: IManagedResourceNode | null,
        pointer: number,
        byteSize: number,
    )
    {
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.pointer = pointer;
        this.byteSize = byteSize;
        this.impl = new SharedMemoryBlockImpl(this, pointer, byteSize);
        SharedObjectCleanup.registerCleanup(
            this,
            this.impl,
            new SharedObjectCleanup.Options("SharedMemoryBlock", _BUILD.DEBUG ? new DebugProtectedView(
                    `SharedMemoryBlock - memory resize danger: don't hold reference to the DataView ${numberGetHexString(pointer)}`,
                ) : null,
                ESharedObjectOwnerKind.Freeable
            )
        );
    }

    // @internal
    public debugOnAllocate?: (() => void);
    private impl: SharedMemoryBlockImpl;
}

class SharedMemoryBlockImpl
    extends SharedObjectCleanup
    implements IOnMemoryResize, IOnFreeListener
{
    public dataView: DataView;

    public constructor
    (
        sharedMemoryBlock: SharedMemoryBlock,
        public readonly pointer: number,
        public readonly byteSize: number,
    )
    {
        super(sharedMemoryBlock, ESharedObjectOwnerKind.Freeable);
        this.dataView = this.recreateDataView();
        this.wrapper.memoryResize.addListener(this);
    }

    public onFree(): void
    {
        super.onFree();
        this.wrapper.memoryResize.removeListener(this);
    }

    public onMemoryResize(): void
    {
        if (this.wrapper == null)
        {
            _BUILD.DEBUG && _Debug.error("object has been destroyed");
            return;
        }

        this.dataView = this.recreateDataView();
    }

    private recreateDataView(): DataView
    {
        return new DataView(this.wrapper.memory.buffer, this.pointer, this.byteSize);
    }
}
