import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor";
import { _Debug } from "../../debug/_debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";
import { DebugProtectedView } from "../../debug/debug-protected-view";
import { ISharedArray } from "./i-shared-array";
import { IReferenceCountedPtr, ReferenceCountedPtr } from "../../lifecycle/reference-counted-ptr";
import { DebugSharedObjectChecks } from "../debug-shared-object-checks";
import { ISharedArrayBindings } from "./i-shared-array-bindings";
import { IOnFree } from "../../lifecycle/i-on-free";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize";

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
    implements ISharedArray<TCtor>,
               IOnFree,
               IOnMemoryResize
{
    public static createOneF32(wrapper: IEmscriptenWrapper<ISharedArrayBindings>, pointer: number, length: number): TF32SharedStaticArray
    {
        return new SharedStaticArray(Float32Array, wrapper, pointer, length);
    }

    public static createOneF64(wrapper: IEmscriptenWrapper<ISharedArrayBindings>, pointer: number, length: number): TF64SharedStaticArray
    {
        return new SharedStaticArray(Float64Array, wrapper, pointer, length);
    }

    public readonly ctor: TCtor;
    public readonly length: number;
    public readonly elementByteSize: number;
    public readonly sharedObject: IReferenceCountedPtr;
    public debugOnAllocate?: (() => void);

    public getInstance(): InstanceType<TCtor>
    {
        if (DEBUG_MODE)
        {
            _Debug.assert(this.wrapper != null, "access violation - object has been destroyed");

            return RcJsUtilDebug.protectedViews
                .getValue(this)
                .createProtectedView(this.instance);
        }
        else
        {
            return this.instance;
        }
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

    public onFree(): void
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object already released");
            return;
        }

        DEBUG_MODE && _Debug.runBlock(() => DebugSharedObjectChecks.unregister(this, ""));

        this.wrapper.memoryResize.removeListener(this);
        this.wrapper = null;
    }

    protected constructor
    (
        ctor: TCtor,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        pointer: number,
        length: number,
    )
    {
        this.sharedObject = new ReferenceCountedPtr(true, pointer, this);
        this.length = length;
        this.ctor = ctor;
        this.wrapper = wrapper;
        this.elementByteSize = ctor.BYTES_PER_ELEMENT;

        DEBUG_MODE && _Debug.runBlock(() =>
        {
            DebugSharedObjectChecks.register(this, DebugProtectedView.createTypedArrayView(), "");
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

        return new this.ctor(this.wrapper.memory.buffer, this.sharedObject.getPtr(), this.length) as InstanceType<TCtor>;
    }

    private wrapper: IEmscriptenWrapper<ISharedArrayBindings> | null;
    private instance: InstanceType<TCtor>;
}