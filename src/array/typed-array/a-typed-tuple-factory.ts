import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { TTypedArrayCtor } from "./t-typed-array-ctor";
import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper";
import { TDebugListener } from "rc-js-util-globals";
import { DebugProtectedView } from "../../debug/debug-protected-view";

export abstract class ATypedTupleFactory<T extends object, TCtorArgs extends number[]>
    implements ITypedArrayTupleFactory<T, TCtorArgs>
{
    protected constructor
    (
        protected readonly length: number,
        private readonly ctor: TTypedArrayCtor,
    )
    {
    }

    public abstract createOne(...args: TCtorArgs): T;

    public abstract copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo?: T,
        littleEndian?: boolean,
    )
        : T;

    public abstract copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian?: boolean,
    )
        : void;

    public createOneEmpty(): T
    {
        return new this.ctor(this.length) as unknown as T;
    }

    public createOneReusingBuffer(wrapper: IEmscriptenWrapper, pointerToStatic: number): T
    {
        const instance = new this.ctor(wrapper.memory.buffer, pointerToStatic, this.length) as unknown as T;

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
}