import { IOnRelease, IReferenceCountedPtr, ISharedObject, ReferenceCountedPtr } from "../lifecycle/reference-counted-ptr";
import { IEmscriptenWrapper } from "./emscripten/i-emscripten-wrapper";
import { nullPointer } from "./emscripten/null-pointer";
import { _Production } from "../production/_production";
import { DebugProtectedView } from "../debug/debug-protected-view";
import { _Debug } from "../debug/_debug";
import { DebugSharedObjectChecks } from "./debug-shared-object-checks";
import { IMemoryUtilBindings } from "./emscripten/i-memory-util-bindings";
import { _Number } from "../number/_number";

/**
 * @public
 * Provides a reference counted wrapper to a pointer `malloc`'d from JS and is `free`'d on reference count hitting 0.
 */
export interface IRawVoidPointer extends ISharedObject, IOnRelease
{
    readonly pointer: number;
    readonly byteSize: number;
    readonly dataView: DataView;
}

/**
 * @public
 */
export class RawVoidPointer implements IRawVoidPointer
{
    public dataView: DataView;
    public readonly sharedObject: IReferenceCountedPtr;
    public readonly pointer: number;
    public readonly byteSize: number;

    public static createOne(wrapper: IEmscriptenWrapper<IMemoryUtilBindings>, byteSize: number): RawVoidPointer
    public static createOne(wrapper: IEmscriptenWrapper<IMemoryUtilBindings>, byteSize: number, allocationFailThrows: boolean): RawVoidPointer;
    public static createOne
    (
        wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        byteSize: number,
        allocationFailThrows?: boolean,
    )
        : RawVoidPointer
    {
        DEBUG_MODE && RcJsUtilDebug.onAllocate.emit();
        const pointer = wrapper.instance._jsUtilMalloc(byteSize);

        if (pointer == nullPointer)
        {
            if (allocationFailThrows ?? false)
            {
                throw _Production.error("Failed to allocate memory for raw pointer.");
            }
        }

        return new RawVoidPointer(wrapper, pointer, byteSize);
    }

    public onRelease(): void
    {
        this.wrapper.memoryResize.removeListener(this);
        this.wrapper.instance._jsUtilFree(this.pointer);
        (this.pointer as number) = nullPointer;

        DEBUG_MODE && _Debug.runBlock(() => DebugSharedObjectChecks.unregister(this, "RVP"));
    }

    public onMemoryResize = (): void =>
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object has been destroyed");
            return;
        }

        this.dataView = this.getDataView();
    }

    protected constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        pointer: number,
        byteSize: number,
    )
    {
        this.pointer = pointer;
        this.byteSize = byteSize;
        this.sharedObject = new ReferenceCountedPtr(false, pointer, this);
        this.wrapper.memoryResize.addListener(this);

        DEBUG_MODE && _Debug.runBlock(() =>
        {
            const protectedView = new DebugProtectedView([], `memory resize danger: don't hold reference to the DataView ${_Number.getHexString(this.pointer)}`);
            this.debugOnAllocate = () =>
            {
                protectedView.invalidate();
                this.dataView = this.getDataView();
            };
            DebugSharedObjectChecks.register(this, protectedView, "RVP");
        });

        this.dataView = this.getDataView();
    }

    private getDataView(): DataView
    {
        const dataView = new DataView(this.wrapper.memory.buffer, this.pointer, this.byteSize);

        if (DEBUG_MODE)
        {
            return RcJsUtilDebug.protectedViews
                .getValue(this)
                .createProtectedView(dataView);
        }
        else
        {
            return dataView;
        }
    }

    public debugOnAllocate?: (() => void);
}

