import { IReferenceCountedPtr, ReferenceCountedPtr } from "../util/reference-counted-ptr.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { nullPointer } from "../emscripten/null-pointer.js";
import { _Production } from "../../production/_production.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { _Debug } from "../../debug/_debug.js";
import { DebugSharedObjectChecks } from "../util/debug-shared-object-checks.js";
import { IMemoryUtilBindings } from "../emscripten/i-memory-util-bindings.js";
import { _Number } from "../../number/_number.js";
import { ISharedObject } from "../../lifecycle/i-shared-object.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { IDebugAllocateListener } from "../../debug/i-debug-allocate-listener.js";
import { ILinkedReferences } from "../../lifecycle/linked-references.js";

/**
 * @public
 * Provides a reference counted wrapper to a pointer `malloc`'d from JS and is `free`'d on reference count hitting 0.
 */
export interface ISharedMemoryBlock
    extends ISharedObject,
            IOnMemoryResize
{
    readonly pointer: number;
    readonly byteSize: number;
    getDataView(): DataView;
}

/**
 * @public
 * {@inheritDoc ISharedMemoryBlock}
 */
export class SharedMemoryBlock implements ISharedMemoryBlock, IDebugAllocateListener
{
    public readonly sharedObject: IReferenceCountedPtr;
    public readonly pointer: number;
    public readonly byteSize: number;

    /**
     * @throws exception if allocation cannot be performed.
     */
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        bindToReference: ILinkedReferences,
        byteSize: number,
    )
        : SharedMemoryBlock
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        bindToReference: ILinkedReferences,
        byteSize: number,
        allocationFailThrows: boolean,
    )
        : SharedMemoryBlock | null
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        bindToReference: ILinkedReferences,
        byteSize: number,
        allocationFailThrows: boolean = true,
    )
        : SharedMemoryBlock | null
    {
        _BUILD.DEBUG && wrapper.debug.onAllocate.emit();
        const pointer = wrapper.instance._jsUtilMalloc(byteSize);

        if (pointer == nullPointer)
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

        const smb = new SharedMemoryBlock(wrapper, pointer, byteSize);
        bindToReference.linkRef(smb.sharedObject);
        return smb;
    }

    public getDataView(): DataView
    {
        if (_BUILD.DEBUG)
        {
            return this.wrapper.debug.protectedViews
                .getValue(this)
                .createProtectedView(this.dataView);
        }
        else
        {
            return this.dataView;
        }
    }

    public onMemoryResize = (): void =>
    {
        if (this.wrapper == null)
        {
            _BUILD.DEBUG && _Debug.error("object has been destroyed");
            return;
        }

        this.dataView = this.recreateDataView();
    };

    protected constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        pointer: number,
        byteSize: number,
    )
    {
        this.pointer = pointer;
        this.byteSize = byteSize;
        this.sharedObject = new ReferenceCountedPtr(false, pointer, wrapper);
        this.sharedObject.registerOnFreeListener(this.wrapper.memoryResize.addTemporaryListener(this));
        this.sharedObject.registerOnFreeListener(() => this.wrapper.instance._jsUtilFree(this.pointer));

        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            const protectedView = new DebugProtectedView(
                this.wrapper,
                `SharedMemoryBlock - memory resize danger: don't hold reference to the DataView ${_Number.getHexString(this.pointer)}`,
            );
            DebugSharedObjectChecks.registerWithCleanup(this, protectedView, "SharedMemoryBlock");
        });

        this.dataView = this.recreateDataView();
    }

    private recreateDataView(): DataView
    {
        return new DataView(this.wrapper.memory.buffer, this.pointer, this.byteSize);
    }

    private dataView: DataView;
    public debugOnAllocate?: (() => void);
}

