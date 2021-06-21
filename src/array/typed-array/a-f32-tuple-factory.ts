import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper";
import { DebugProtectedView } from "../../debug/debug-protected-view";
import { TDebugListener } from "rc-js-util-globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AF32TupleFactory<T extends object, TCtorArgs extends number[]>
    implements ITypedArrayTupleFactory<T, TCtorArgs>
{
    protected constructor
    (
        private readonly length: number,
    )
    {
    }

    public abstract createOne(...args: TCtorArgs): T;

    public createOneEmpty(): T
    {
        return new Float32Array(this.length) as unknown as T;
    }

    public createOneReusingBuffer(wrapper: IEmscriptenWrapper, pointerToStatic: number): T
    {
        const instance = new Float32Array(wrapper.memory.buffer, pointerToStatic, this.length) as unknown as T;

        if (DEBUG_MODE)
        {
            const debugInstance = (instance as TDebugListener<"debugOnAllocate", []>);
            const protectedView = DebugProtectedView.createTypedArrayView();
            debugInstance.debugOnAllocate = () => protectedView.invalidate();
            RcJsUtilDebug.protectedViews.setValue(debugInstance, protectedView);
            RcJsUtilDebug.onAllocate.addListener(debugInstance);

            return protectedView.createProtectedView<T>(instance);
        }

        return instance;
    }

    public copyFromBuffer
    (
        bufferView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            (writeTo as unknown as number[])[i] = bufferView.getFloat32(pointer, littleEndian);
            pointer += Float32Array.BYTES_PER_ELEMENT;
        }

        return writeTo;
    }

    public copyToBuffer
    (
        bufferView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            bufferView.setFloat32(pointer, (writeFrom as unknown as number[])[i], littleEndian);
            pointer += Float32Array.BYTES_PER_ELEMENT;
        }
    }
}