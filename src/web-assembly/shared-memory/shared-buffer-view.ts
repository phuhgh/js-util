import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { _Debug } from "../../debug/_debug.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { type IManagedObject, type IManagedResourceNode, type IOnFreeListener, type IPointer } from "../../lifecycle/manged-resources.js";
import { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import type { IBuffer } from "../../array/typed-array/i-buffer-view.js";
import { ENumberIdentifier, getNumberIdentifier } from "../../runtime/rtti-interop.js";
import type { IInteropBindings } from "../emscripten/i-interop-bindings.js";
import { ESharedObjectOwnerKind, SharedObjectCleanup } from "./shared-object-cleanup.js";

/**
 * @public
 * Provides a view into shared memory, which avoids the need to keep recreating shared arrays. The view is NOT owning.
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

    public getWrapper(): IEmscriptenWrapper<IInteropBindings>
    {
        return this.wrapper;
    }

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
        protected readonly wrapper: IEmscriptenWrapper<IInteropBindings>,
        owner: IManagedResourceNode | null,
        ctor: TCtor,
        pointerToData: number,
        byteSize: number,
    )
    {
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.ctor = ctor;
        this.pointer = pointerToData;
        this.byteSize = byteSize;
        this.numberId = getNumberIdentifier(ctor);
        this.impl = new SharedBufferViewImpl(this, ctor, pointerToData, byteSize);
        SharedObjectCleanup.registerCleanup(
            this,
            this.impl,
            new SharedObjectCleanup.Options(
                "SharedBufferView",
                _BUILD.DEBUG ? new DebugProtectedView(
                    `SharedBufferView - memory resize danger: don't hold reference to the DataView ${numberGetHexString(pointerToData)}`,
                ) : null,
                ESharedObjectOwnerKind.NotOwning,
            )
        );
    }

    private readonly impl: SharedBufferViewImpl<TCtor>;
}

class SharedBufferViewImpl<TCtor extends TTypedArrayCtor>
    extends SharedObjectCleanup
    implements IOnMemoryResize, IOnFreeListener
{
    public dataView: DataView;
    public array: InstanceType<TCtor>;

    public constructor
    (
        sbv: SharedBufferView<TCtor>,
        public readonly ctor: TCtor,
        public readonly pointer: number,
        public readonly byteSize: number,
    )
    {
        super(sbv, ESharedObjectOwnerKind.NotOwning);
        this.dataView = this.recreateDataView();
        this.array = this.recreateArray();
        this.wrapper.memoryResize.addListener(this);
    }

    public onFree()
    {
        super.onFree();
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
