import { IReferenceCountedPtr, ReferenceCountedPtr } from "../lifecycle/reference-counted-ptr";
import { _Debug, DebugProtectedView } from "@rc-js-util/debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";
import { nullPointer } from "../emscripten/null-pointer";
import { ISharedArray } from "./i-shared-array";
import { DebugSharedObjectChecks } from "../debug-shared-object-checks";
import { ISharedArrayBindings, TSharedArrayPrefix } from "./i-shared-array-bindings";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize";
import { TTypedArrayCtor } from "@rc-js-util/types/bin/impl/t-typed-array-ctor";
import { _Production } from "@rc-js-util/core";

/**
 * @public
 * Float32 {@link ISharedArray}.
 */
export type TF32SharedArray = ISharedArray<Float32ArrayConstructor>;

/**
 * @public
 * Float64 {@link ISharedArray}.
 */
export type TF64SharedArray = ISharedArray<Float64ArrayConstructor>;

/**
 * @public
 * Typed array shared between wasm and javascript.
 */
export class SharedArray<TCtor extends TTypedArrayCtor>
    implements ISharedArray<TCtor>,
               IOnMemoryResize
{
    public static createOneF32(wrapper: IEmscriptenWrapper<ISharedArrayBindings>, length: number, clearMemory?: boolean): TF32SharedArray
    public static createOneF32(wrapper: IEmscriptenWrapper<ISharedArrayBindings>, length: number, clearMemory: boolean, allocationFailThrows: boolean): TF32SharedArray | null
    public static createOneF32
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        length: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : TF32SharedArray | null
    {
        return SharedArray.createOne("f32SharedArray", wrapper, Float32Array, length, clearMemory, allocationFailThrows);
    }

    public static createOneF64(wrapper: IEmscriptenWrapper<ISharedArrayBindings>, length: number, clearMemory?: boolean): TF64SharedArray
    public static createOneF64(wrapper: IEmscriptenWrapper<ISharedArrayBindings>, length: number, clearMemory: boolean, allocationFailThrows: boolean): TF64SharedArray | null
    public static createOneF64
    (
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        length: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : TF64SharedArray | null
    {
        return SharedArray.createOne("f64SharedArray", wrapper, Float64Array, length, clearMemory, allocationFailThrows);
    }

    private static createOne<TCtor extends TTypedArrayCtor>
    (
        prefix: TSharedArrayPrefix,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        ctor: TCtor,
        length: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : ISharedArray<TCtor> | null
    {
        const ptr = SharedArray.allocateMemory(prefix, wrapper, length, clearMemory, allocationFailThrows);

        if (ptr !== nullPointer)
        {
            return new SharedArray(prefix, ctor, wrapper, length, ptr);
        }

        return null;
    }

    private static allocateMemory
    (
        cMethodPrefix: TSharedArrayPrefix,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        length: number,
        clearMemory: boolean,
        allocationFailThrows: boolean,
    )
        : number
    {
        const ptr = wrapper.instance[`_${cMethodPrefix}_createOne`](length, clearMemory);

        if (ptr === nullPointer && allocationFailThrows)
        {
            throw _Production.createError("Failed to allocate memory for shared array.");
        }

        return ptr;
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
            _Debug.assert(!this.sharedObject.getIsDestroyed(), "access violation - object has been destroyed");
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
        this.instance = this.createLocalInstance();
    }

    protected constructor
    (
        cMethodPrefix: TSharedArrayPrefix,
        ctor: TCtor,
        wrapper: IEmscriptenWrapper<ISharedArrayBindings>,
        length: number,
        pointer: number,
    )
    {
        this.sharedObject = new ReferenceCountedPtr(false, pointer);
        this.sharedObject.registerOnFreeListener(() => this.wrapper.instance[this.cDelete](this.sharedObject.getPtr()));
        this.sharedObject.registerOnFreeListener(wrapper.memoryResize.addTemporaryListener(this));
        this.length = length;
        this.ctor = ctor;
        this.cDelete = `_${cMethodPrefix}_delete`;
        this.cGetArrayAddress = `_${cMethodPrefix}_getArrayAddress`;
        this.wrapper = wrapper;
        this.elementByteSize = ctor.BYTES_PER_ELEMENT;

        DEBUG_MODE && _Debug.runBlock(() =>
        {
            const protectedView = DebugProtectedView.createTypedArrayView();
            DebugSharedObjectChecks.registerWithCleanup(this, protectedView, "shared array");
        });

        this.instance = this.createLocalInstance();
    }

    private createLocalInstance(): InstanceType<TCtor>
    {
        const arrayPtr = this.wrapper.instance[this.cGetArrayAddress](this.sharedObject.getPtr());
        DEBUG_MODE && _Debug.assert(arrayPtr !== nullPointer, "failed to get array address");

        return new this.ctor(this.wrapper.memory.buffer, arrayPtr, this.length) as InstanceType<TCtor>;
    }

    private instance: InstanceType<TCtor>;
    private readonly wrapper: IEmscriptenWrapper<ISharedArrayBindings>;
    private readonly cGetArrayAddress: `_${TSharedArrayPrefix}_getArrayAddress`;
    private readonly cDelete: `_${TSharedArrayPrefix}_delete`;
}
