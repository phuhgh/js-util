import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor";
import { _Debug } from "../../debug/_debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";
import { DebugProtectedView } from "../../debug/debug-protected-view";
import { ISharedArray } from "./i-shared-array";
import { IReferenceCountedPtr, ReferenceCountedPtr } from "../../lifecycle/reference-counted-ptr";
import { DebugSharedObjectChecks } from "../debug-shared-object-checks";
import { ISharedArrayBindings } from "./i-shared-array-bindings";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize";
import { IDebugAllocateListener } from "../../debug/i-debug-allocate-listener";

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
               IOnMemoryResize,
               IDebugAllocateListener
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
        if (_BUILD.DEBUG)
        {
            _Debug.assert(!this.sharedObject.getIsDestroyed(), "access violation - object has been destroyed");
            return this.wrapper.debug.protectedViews
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
        this.instance = this.createLocalInstance();
    };

    protected constructor
    (
        ctor: TCtor,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        pointer: number,
        length: number,
    )
    {
        this.sharedObject = new ReferenceCountedPtr(true, pointer, wrapper);
        this.length = length;
        this.ctor = ctor;
        this.wrapper = wrapper;
        this.elementByteSize = ctor.BYTES_PER_ELEMENT;

        _BUILD.DEBUG && _Debug.runBlock(() =>
        {
            DebugSharedObjectChecks.registerWithCleanup(this, DebugProtectedView.createTypedArrayView(this.wrapper), "");
        });

        this.sharedObject.registerOnFreeListener(wrapper.memoryResize.addTemporaryListener(this));
        this.instance = this.createLocalInstance();
    }

    private createLocalInstance(): InstanceType<TCtor>
    {
        return new this.ctor(this.wrapper.memory.buffer, this.sharedObject.getPtr(), this.length) as InstanceType<TCtor>;
    }

    private readonly wrapper: IEmscriptenWrapper<ISharedArrayBindings>;
    private instance: InstanceType<TCtor>;
}