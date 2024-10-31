import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { nullPtr } from "../emscripten/null-pointer.js";
import { _Production } from "../../production/_production.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { _Debug } from "../../debug/_debug.js";
import { IMemoryUtilBindings } from "../emscripten/i-memory-util-bindings.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { type IManagedObject, type IManagedResourceNode, type IOnFreeListener, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";

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
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        bindToReference: IManagedResourceNode | null,
        byteSize: number,
    )
        : SharedMemoryBlock
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        bindToReference: IManagedResourceNode | null,
        byteSize: number,
        allocationFailThrows: boolean,
    )
        : SharedMemoryBlock | null
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
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
                throw _Production.createError("Failed to allocate memory for shared memory block.");
            }
            else
            {
                return null;
            }
        }

        return new SharedMemoryBlock(wrapper, bindToReference, pointer, byteSize);
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
        private readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        owner: IManagedResourceNode | null,
        pointer: number,
        byteSize: number,
    )
    {
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.pointer = pointer;
        this.byteSize = byteSize;
        this.impl = new SharedMemoryBlockImpl(wrapper, pointer, byteSize);

        const protectedView = _BUILD.DEBUG ? new DebugProtectedView(
            `SharedMemoryBlock - memory resize danger: don't hold reference to the DataView ${numberGetHexString(this.pointer)}`,
        ) : null;
        wrapper.lifecycleStrategy.onSharedPointerCreated(this, new PointerDebugMetadata(this.pointer, true, "SharedMemoryBlock"), protectedView);
        this.wrapper.memoryResize.addListener(this.impl);
        this.resourceHandle.onFreeChannel.addListener(this.impl);
    }

    // @internal
    public debugOnAllocate?: (() => void);
    private impl: SharedMemoryBlockImpl;
}

class SharedMemoryBlockImpl
    implements IOnMemoryResize, IOnFreeListener
{
    public dataView: DataView;

    public constructor
    (
        public readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        public readonly pointer: number,
        public readonly byteSize: number,
    )
    {
        this.dataView = this.recreateDataView();
    }

    public onFree(): void
    {
        this.wrapper.memoryResize.removeListener(this);
        this.wrapper.instance._jsUtilFree(this.pointer);
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
