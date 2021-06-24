import { ITypedArrayTupleFactory } from "./i-typed-array-tuple-factory";
import { TTypedArrayCtor } from "./t-typed-array-ctor";
import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper";
import { TDebugListener } from "rc-js-util-globals";
import { DebugProtectedView } from "../../debug/debug-protected-view";
import { INormalizedDataView } from "./normalized-data-view/i-normalized-data-view";
import { NormalizedDataViewProvider } from "./normalized-data-view/normalized-data-view-provider";

export abstract class ATypedTupleFactory<T extends object, TCtorArgs extends number[]>
    implements ITypedArrayTupleFactory<T, TCtorArgs>
{
    protected constructor
    (
        protected readonly length: number,
        protected readonly ctor: TTypedArrayCtor,
    )
    {
        this.dataView = NormalizedDataViewProvider.getView(ctor);
    }

    public abstract createOne(...args: TCtorArgs): T;

    public copyFromBuffer
    (
        memoryDataView: DataView,
        pointer: number,
        writeTo: T = this.createOneEmpty(),
        littleEndian: boolean = true,
    )
        : T
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            (writeTo as unknown as number[])[i] = this.dataView.getValue(memoryDataView, pointer, littleEndian);
            pointer += this.ctor.BYTES_PER_ELEMENT;
        }

        return writeTo;
    }

    public copyToBuffer
    (
        memoryDataView: DataView,
        writeFrom: T,
        pointer: number,
        littleEndian: boolean = true,
    )
        : void
    {
        for (let i = 0, iEnd = this.length; i < iEnd; ++i)
        {
            this.dataView.setValue(memoryDataView, pointer, (writeFrom as unknown as number[])[i], littleEndian);
            pointer += this.ctor.BYTES_PER_ELEMENT;
        }
    }

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

    protected dataView: INormalizedDataView;
}