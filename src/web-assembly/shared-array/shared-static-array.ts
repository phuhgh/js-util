import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor";
import { _Debug } from "../../debug/_debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";
import { DebugProtectedView } from "../../debug/debug-protected-view";
import { ISharedArray } from "./i-shared-array";
import { TDebugListener } from "rc-js-util-globals";
import { IReferenceCountedPtr, ReferenceCountedPtr } from "../../lifecycle/reference-counted-ptr";

/**
 * @public
 * Float32 {@link ISharedArray} (static).
 */
export type TF32SharedStaticArray = ISharedArray<Float32ArrayConstructor>;
/**
 * @public
 * Float64 {@link ISharedArray} (static).
 */
export type TF64SharedStaticArray = ISharedArray<Float64ArrayConstructor>;

/**
 * @public
 * Typed array representing static memory in wasm.
 */
export class SharedStaticArray<TCtor extends TTypedArrayCtor>
    implements ISharedArray<TCtor>, TDebugListener<"debugOnAllocate", []>
{
    public static createOneF32(wrapper: IEmscriptenWrapper, pointer: number, size: number): TF32SharedStaticArray
    {
        return new SharedStaticArray(Float32Array, wrapper, pointer, size);
    }

    public static createOneF64(wrapper: IEmscriptenWrapper, pointer: number, size: number): TF64SharedStaticArray
    {
        return new SharedStaticArray(Float64Array, wrapper, pointer, size);
    }

    public readonly ctor: TCtor;
    public readonly size: number;
    public readonly elementByteSize: number;
    public readonly sharedObject: IReferenceCountedPtr;
    public debugOnAllocate?: (() => void);

    public getInstance(): InstanceType<TCtor>
    {
        DEBUG_MODE && _Debug.assert(this.wrapper != null, "access violation - object has been destroyed");

        return this.instance;
    }

    public onMemoryResize = (): void =>
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object has been destroyed");
            return;
        }

        this.instance = this.createLocalInstance();
    }

    public onRelease(): void
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object already released");
            return;
        }

        DEBUG_MODE && _Debug.runBlock(() =>
        {
            RcJsUtilDebug.sharedObjectLifeCycleChecks.markReadyForFinalize(this.sharedObject);
            RcJsUtilDebug.protectedViews
                .getValue(this)
                .invalidate();
        });

        this.wrapper.memoryResize.removeListener(this);
        this.wrapper = null;
    }

    protected constructor
    (
        ctor: TCtor,
        wrapper: IEmscriptenWrapper,
        pointer: number,
        size: number,
    )
    {
        this.sharedObject = new ReferenceCountedPtr(true, pointer, this);
        this.size = size;
        this.ctor = ctor;
        this.wrapper = wrapper;
        this.elementByteSize = ctor.BYTES_PER_ELEMENT;

        DEBUG_MODE && _Debug.runBlock(() =>
        {
            const protectedView = DebugProtectedView.createTypedArrayView();
            this.debugOnAllocate = () => protectedView.invalidate();
            RcJsUtilDebug.protectedViews.setValue(this, protectedView);
            RcJsUtilDebug.sharedObjectLifeCycleChecks.registerFinalizationCheck(this.sharedObject);
            RcJsUtilDebug.onAllocate.addListener(this);
        });

        wrapper.memoryResize.addListener(this);
        this.instance = this.createLocalInstance();
    }

    private createLocalInstance(): InstanceType<TCtor>
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object has been destroyed");
            return new this.ctor(0) as InstanceType<TCtor>;
        }

        const instance = new this.ctor(this.wrapper.memory.buffer, this.sharedObject.getPtr(), this.size) as InstanceType<TCtor>;

        if (DEBUG_MODE)
        {
            return RcJsUtilDebug.protectedViews.getValue(this).createProtectedView(instance);
        }

        return instance;
    }

    private wrapper: IEmscriptenWrapper | null;
    private instance: InstanceType<TCtor>;
}