import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor";
import { ASharedObject } from "../../lifecycle/a-shared-object";
import { _Debug } from "../../debug/_debug";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper";

/**
 * @public
 */
export type TSharedArrayF32 = SharedArray<Float32ArrayConstructor>;
/**
 * @public
 */
export type TSharedArrayF64 = SharedArray<Float64ArrayConstructor>;

/**
 * @public
 * Typed array shared between wasm and javascript.
 */
export class SharedArray<TCtor extends TTypedArrayCtor> extends ASharedObject
{
    public static createOneF32
    (
        wrapper: IEmscriptenWrapper,
        initialSize: number,
    )
        : TSharedArrayF32
    {
        return new SharedArray("_f32SharedVector", Float32Array, wrapper, initialSize);
    }

    public static createOneF64
    (
        wrapper: IEmscriptenWrapper,
        initialSize: number,
    )
        : TSharedArrayF64
    {
        return new SharedArray("_f64SharedVector", Float64Array, wrapper, initialSize);
    }

    public getInstance(): InstanceType<TCtor>
    {
        DEBUG_MODE && _Debug.assert(this.wrapper != null, "access violation - object has been destroyed");

        return this.instance;
    }

    protected onRelease(): void
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object already released");
            return;
        }

        this.wrapper.memoryResize.removeListener(this.onEventMemoryResize);
        this.wrapper.instance[this.cDelete](this.wasmPtr);
        this.wrapper = null;
    }

    protected constructor
    (
        cMethodPrefix: string,
        ctor: TCtor,
        wrapper: IEmscriptenWrapper,
        initialSize: number,
    )
    {
        super(wrapper.instance[`${cMethodPrefix}_createOne`](initialSize));
        this.ctor = ctor;
        this.cDelete = `${cMethodPrefix}_delete`;
        this.cGetArrayAddress = `${cMethodPrefix}_getArrayAddress`;
        this.cGetSize = `${cMethodPrefix}_getSize`;
        this.wrapper = wrapper;
        wrapper.memoryResize.addListener(this.onEventMemoryResize);
        this.instance = this.createInstance(initialSize);
    }

    private createInstance(size: number): InstanceType<TCtor>
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object has been destroyed");
            return new this.ctor(0) as InstanceType<TCtor>;
        }

        const arrayPtr = this.wrapper.instance[this.cGetArrayAddress](this.wasmPtr);

        return new this.ctor(this.wrapper.memory.buffer, arrayPtr, size) as InstanceType<TCtor>;
    }

    private onEventMemoryResize = (): void =>
    {
        if (this.wrapper == null)
        {
            DEBUG_MODE && _Debug.error("object has been destroyed");
            return;
        }

        const size = this.wrapper.instance[this.cGetSize](this.wasmPtr) as number;
        this.instance = this.createInstance(size);
    }

    private wrapper: IEmscriptenWrapper | null;
    private instance: InstanceType<TCtor>;

    private readonly ctor: TCtor;
    private readonly cGetArrayAddress: string;
    private readonly cGetSize: string;
    private readonly cDelete: string;
}