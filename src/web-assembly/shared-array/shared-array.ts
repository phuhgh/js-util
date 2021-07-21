import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor";
import { IReferenceCountedPtr, ReferenceCountedPtr } from "../../lifecycle/reference-counted-ptr";
import { _Debug } from "../../debug/_debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";
import { DebugProtectedView } from "../../debug/debug-protected-view";
import { _Production } from "../../production/_production";
import { nullPointer } from "../emscripten/null-pointer";
import { ISharedArray } from "./i-shared-array";
import { stringNormalizeNullUndefinedToEmpty } from "../../string/impl/string-normalize-null-undefined-to-empty";
import { numberGetHexString } from "../../number/impl/number-get-hex-string";
import { TDebugListener } from "rc-js-util-globals";

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
    implements ISharedArray<TCtor>, TDebugListener<"debugOnAllocate", []>
{
    public static createOneF32(wrapper: IEmscriptenWrapper, size: number, clearMemory?: boolean): TF32SharedArray
    public static createOneF32(wrapper: IEmscriptenWrapper, size: number, clearMemory: boolean, allocationFailThrows: boolean): TF32SharedArray | null
    public static createOneF32
    (
        wrapper: IEmscriptenWrapper,
        size: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : TF32SharedArray | null
    {
        return SharedArray.createOne("_f32SharedArray", wrapper, Float32Array, size, clearMemory, allocationFailThrows);
    }

    public static createOneF64(wrapper: IEmscriptenWrapper, size: number, clearMemory?: boolean): TF64SharedArray
    public static createOneF64(wrapper: IEmscriptenWrapper, size: number, clearMemory: boolean, allocationFailThrows: boolean): TF64SharedArray | null
    public static createOneF64
    (
        wrapper: IEmscriptenWrapper,
        size: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : TF64SharedArray | null
    {
        return SharedArray.createOne("_f64SharedArray", wrapper, Float64Array, size, clearMemory, allocationFailThrows);
    }

    private static createOne<TCtor extends TTypedArrayCtor>
    (
        prefix: string,
        wrapper: IEmscriptenWrapper,
        ctor: TCtor,
        size: number,
        clearMemory: boolean = false,
        allocationFailThrows: boolean = true,
    )
        : ISharedArray<TCtor> | null
    {
        const ptr = SharedArray.allocateMemory(prefix, wrapper, size, clearMemory, allocationFailThrows);

        if (ptr !== nullPointer)
        {
            return new SharedArray(prefix, ctor, wrapper, size, ptr);
        }

        return null;
    }

    private static allocateMemory
    (
        cMethodPrefix: string,
        wrapper: IEmscriptenWrapper,
        size: number,
        clearMemory: boolean,
        allocationFailThrows: boolean,
    )
        : number
    {
        const ptr = wrapper.instance[`${cMethodPrefix}_createOne`](size, clearMemory);

        if (ptr === nullPointer && allocationFailThrows)
        {
            throw _Production.error("Failed to allocate memory for shared array.");
        }

        return ptr;
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
            _Debug.verboseLog(`released shared array ${numberGetHexString(this.sharedObject.getPtr())} - ${stringNormalizeNullUndefinedToEmpty(_Debug.label)}`);
        });

        this.wrapper.memoryResize.removeListener(this);
        this.wrapper.instance[this.cDelete](this.sharedObject.getPtr());
        this.wrapper = null;
    }

    protected constructor
    (
        cMethodPrefix: string,
        ctor: TCtor,
        wrapper: IEmscriptenWrapper,
        size: number,
        pointer: number,
    )
    {
        this.sharedObject = new ReferenceCountedPtr(false, pointer, this);
        this.size = size;
        this.ctor = ctor;
        this.cDelete = `${cMethodPrefix}_delete`;
        this.cGetArrayAddress = `${cMethodPrefix}_getArrayAddress`;
        this.wrapper = wrapper;
        this.elementByteSize = ctor.BYTES_PER_ELEMENT;

        DEBUG_MODE && _Debug.runBlock(() =>
        {
            const protectedView = DebugProtectedView.createTypedArrayView();
            this.debugOnAllocate = () => protectedView.invalidate();
            RcJsUtilDebug.protectedViews.setValue(this, protectedView);
            RcJsUtilDebug.sharedObjectLifeCycleChecks.registerFinalizationCheck(this.sharedObject);
            RcJsUtilDebug.onAllocate.addListener(this);

            if (_Debug.isFlagSet("DEBUG_VERBOSE_MEMORY_MANAGEMENT"))
            {
                _Debug.verboseLog(`claimed shared array ${numberGetHexString(this.sharedObject.getPtr())} - ${stringNormalizeNullUndefinedToEmpty(_Debug.label)}`);
            }
        });

        wrapper.memoryResize.addListener(this);
        this.instance = this.createLocalInstance();
    }

    private createLocalInstance(): InstanceType<TCtor>
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object has been destroyed");
            return new this.ctor(this.size) as InstanceType<TCtor>;
        }

        const arrayPtr = this.wrapper.instance[this.cGetArrayAddress](this.sharedObject.getPtr());
        DEBUG_MODE && _Debug.assert(arrayPtr !== nullPointer, "failed to get array address");
        const instance = new this.ctor(this.wrapper.memory.buffer, arrayPtr, this.size) as InstanceType<TCtor>;

        if (DEBUG_MODE)
        {
            return RcJsUtilDebug.protectedViews
                .getValue(this)
                .createProtectedView(instance);
        }

        return instance;
    }

    private wrapper: IEmscriptenWrapper | null;
    private instance: InstanceType<TCtor>;
    private readonly cGetArrayAddress: string;
    private readonly cDelete: string;
}