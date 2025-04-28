import { ATypedArrayTuple } from "../../array/typed-array/a-typed-array-tuple.js";
import { TTypedArray } from "../../array/typed-array/t-typed-array.js";
import type { IManagedObject, IManagedResourceNode, IOnFreeListener, IPointer } from "../../lifecycle/manged-resources.js";
import { IEmscriptenWrapper } from "../emscripten/i-emscripten-wrapper.js";
import { ESharedObjectOwnerKind, SharedObjectCleanup } from "../shared-memory/shared-object-cleanup.js";
import { DebugProtectedView } from "../../debug/debug-protected-view.js";
import { numberGetHexString } from "../../number/impl/number-get-hex-string.js";
import { _Debug } from "../../debug/_debug.js";
import { IOnMemoryResize } from "../emscripten/i-on-memory-resize.js";
import { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { ISharedVectorBindings } from "../resizable-array/i-shared-vector-bindings.js";


/**
 * @public
 */
export interface ITypedArrayTuple<TArray extends ATypedArrayTuple<number, TTypedArray>>
    extends IManagedObject,
            IPointer
{
    readonly ctor: new (buffer: ArrayBufferLike, offset: number, byteSize: number) => TArray;
    readonly numberId: ENumberIdentifier;
    // size of the shared array
    readonly byteSize: number;

    getSharedObjectHandle(): IManagedObject | null;
    getDataView(): DataView;
    getArray(): TArray;
}

/**
 * @public
 */
export class TypedArrayTuple<TArray extends ATypedArrayTuple<number, TTypedArray>>
    implements ITypedArrayTuple<TArray>
{
    public readonly ctor: new (buffer: ArrayBufferLike, offset: number, byteSize: number) => TArray;
    public readonly resourceHandle: IManagedResourceNode;
    public readonly pointer: number;
    public readonly byteSize: number;
    public readonly numberId: ENumberIdentifier;

    public constructor
    (
        protected readonly wrapper: IEmscriptenWrapper<ISharedVectorBindings>,
        owner: IManagedResourceNode | null,
        ctor: new (buffer: ArrayBufferLike, offset: number, byteSize: number) => TArray,
        pointerToData: number,
        numberId: ENumberIdentifier,
        byteSize: number,
    )
    {
        this.resourceHandle = wrapper.lifecycleStrategy.createNode(owner);
        this.ctor = ctor;
        this.pointer = pointerToData;
        this.byteSize = byteSize;
        this.numberId = numberId;
        this.impl = new TypedArrayTupleImpl(this, ctor, pointerToData, byteSize);
        SharedObjectCleanup.registerCleanup(
            this,
            this.impl,
            new SharedObjectCleanup.Options(
                "TypedArrayTuple",
                _BUILD.DEBUG ? new DebugProtectedView(
                    `TypedArrayTuple - memory resize danger: don't hold reference to the DataView ${numberGetHexString(pointerToData)}`,
                ) : null,
                ESharedObjectOwnerKind.NotOwning,
            )
        );
    }

    public getWrapper(): IEmscriptenWrapper<ISharedVectorBindings>
    {
        return this.wrapper;
    }

    public getSharedObjectHandle(): IManagedObject
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

    public getArray(): TArray
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

    private readonly impl: TypedArrayTupleImpl<TArray>;
}

class TypedArrayTupleImpl<TArray extends ATypedArrayTuple<number, TTypedArray>>
    extends SharedObjectCleanup
    implements IOnMemoryResize, IOnFreeListener
{
    public dataView: DataView;
    public array: TArray;

    public constructor
    (
        sbv: TypedArrayTuple<TArray>,
        public readonly ctor: new (buffer: ArrayBufferLike, offset: number, byteSize: number) => TArray,
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

    private recreateArray(): TArray
    {
        return new this.ctor(this.wrapper.memory.buffer, this.pointer, this.byteSize);
    }
}
