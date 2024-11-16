import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { _Debug } from "../../debug/_debug.js";
import { IMemoryUtilBindings } from "../emscripten/i-memory-util-bindings.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { type IManagedObject, type IManagedResourceNode, type IOnFreeListener, type IPointer, PointerDebugMetadata } from "../../lifecycle/manged-resources.js";
import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import type { IBuffer } from "../../array/typed-array/i-buffer-view.js";
import { ENumberIdentifier, getNumberIdentifier } from "../../runtime/rtti-interop.js";

/**
 * @public
 * Provides a view into shared memory, which avoids the need to keep recreating shared arrays.
 */
export interface ISharedBufferView<TCtor extends TTypedArrayCtor>
    extends IManagedObject,
            IPointer,
            IBuffer<TCtor>
{
    readonly ctor: TCtor;
}

/**
 * @public
 * {@inheritDoc ISharedBufferView}
 */
export class SharedBufferView<TCtor extends TTypedArrayCtor>
    implements ISharedBufferView<TCtor>
{
    public readonly ctor: TCtor;
    public readonly resourceHandle: IManagedResourceNode;
    public readonly pointer: number;
    public readonly byteSize: number;
    public readonly numberId: ENumberIdentifier;

    public getSharedObjectHandle(): IManagedObject | null
    {
        return this;
    }

    public getDataView(): DataView
    {
        if (_BUILD.DEBUG)
        {
            _Debug.assert(!this.resourceHandle.getIsDestroyed(), "use after free");
            return this.wrapper.debugUtils.protectedViews
                .getValue(this.resourceHandle)
                .createProtectedView(this.impl.dataView);
        }
        else
        {
            return this.impl.dataView;
        }
    }

    public getArray(): InstanceType<TCtor>
    {
        if (_BUILD.DEBUG)
        {
            _Debug.assert(!this.resourceHandle.getIsDestroyed(), "use after free");
            return this.wrapper.debugUtils.protectedViews
                .getValue(this.resourceHandle)
                .createProtectedView(this.impl.array);
        }
        else
        {
            return this.impl.array;
        }
    }

    public constructor
    (
        private readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        owner: IManagedResourceNode | null,
        ctor: TCtor,
        pointer: number,
        byteSize: number,
    )
    {
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.ctor = ctor;
        this.pointer = pointer;
        this.byteSize = byteSize;
        this.impl = new SharedBufferViewImpl(wrapper, ctor, pointer, byteSize);
        this.numberId = getNumberIdentifier(ctor);

        const protectedView = _BUILD.DEBUG ? new DebugProtectedView(
            `SharedBufferView - memory resize danger: don't hold reference to the DataView ${numberGetHexString(this.pointer)}`,
        ) : null;
        wrapper.lifecycleStrategy.onSharedPointerCreated(this, new PointerDebugMetadata(this.pointer, true, "SharedBufferView"), protectedView);
        this.wrapper.memoryResize.addListener(this.impl);
        this.resourceHandle.onFreeChannel.addListener(this.impl);
    }

    private impl: SharedBufferViewImpl<TCtor>;
}

class SharedBufferViewImpl<TCtor extends TTypedArrayCtor>
    implements IOnMemoryResize, IOnFreeListener
{
    public dataView: DataView;
    public array: InstanceType<TCtor>;

    public constructor
    (
        public readonly wrapper: IEmscriptenWrapper<IMemoryUtilBindings>,
        public readonly ctor: TCtor,
        public readonly pointer: number,
        public readonly byteSize: number,
    )
    {
        this.dataView = this.recreateDataView();
        this.array = this.recreateArray();
    }

    public onFree(): void
    {
        this.wrapper.memoryResize.removeListener(this);
    }

    public onMemoryResize(): void
    {
        if (this.wrapper == null)
        {
            _BUILD.DEBUG && _Debug.error("object has been destroyed");
            return;
        }

        this.dataView = this.recreateDataView();
        this.array = this.recreateArray();
    }

    private recreateDataView(): DataView
    {
        return new DataView(this.wrapper.memory.buffer, this.pointer, this.byteSize);
    }

    private recreateArray(): InstanceType<TCtor>
    {
        return new this.ctor(this.wrapper.memory.buffer, this.pointer, this.byteSize / this.ctor.BYTES_PER_ELEMENT) as InstanceType<TCtor>;
    }
}
