import type { IBuffer } from "../array/typed-array/i-buffer-view.js";
import type { IManagedObject, IManagedResourceNode } from "../lifecycle/manged-resources.js";
import type { IEmscriptenWrapper } from "../web-assembly/emscripten/i-emscripten-wrapper.js";
import { _Debug } from "../debug/_debug.js";
import type { TTypedArrayCtor } from "../array/typed-array/t-typed-array-ctor.js";
import type { TWriteable } from "../typescript/t-writable.js";

/**
 * @public
 * Describes a buffer in a fashion similar to an OpenGL attribute.
 */
export class SegmentedBufferDescriptor
{
    public readonly end: number;

    public constructor(
        public readonly blockSize: number,
        public readonly stride: number = blockSize,
        public readonly start: number = 0,
        public readonly count: number = -1,
    )
    {
        this.end = start + count;
    }
}


/**
 * @public
 * A view into a typed array.
 */
export interface ISegmentedBufferView<TCTor extends TTypedArrayCtor>
{
    getView(): IBuffer<TCTor>;
    getDescriptor(): SegmentedBufferDescriptor;
}

/**
 * @public
 * A view into a shared typed array.
 */
export interface ISharedSegmentedBufferView<TCTor extends TTypedArrayCtor> extends IManagedObject
{
    getBuffer(): IBuffer<TCTor>;
    getDescriptor(): SegmentedBufferDescriptor;
}

/**
 * @public
 * Creates a view of a (possibly shared) buffer, according to {@link SegmentedBufferDescriptor}.
 */
export function createSegmentedBufferView<TCTor extends TTypedArrayCtor>
(
    buffer: IBuffer<TCTor>,
    descriptor: SegmentedBufferDescriptor,
    wrapper: IEmscriptenWrapper<object>,
    owner: IManagedResourceNode | null,
)
    : ISharedSegmentedBufferView<TCTor>;
export function createSegmentedBufferView<TCTor extends TTypedArrayCtor>
(
    buffer: IBuffer<TCTor>,
    descriptor: SegmentedBufferDescriptor,
)
    : ISharedSegmentedBufferView<TCTor>;
export function createSegmentedBufferView<TCTor extends TTypedArrayCtor>
(
    buffer: IBuffer<TCTor>,
    descriptor: SegmentedBufferDescriptor,
    wrapper?: IEmscriptenWrapper<object>,
    owner?: IManagedResourceNode | null,
)
{
    return new SegmentedBufferView(buffer, descriptor, wrapper ?? null, owner ?? null);
}


class SegmentedBufferView<TCTor extends TTypedArrayCtor> implements IManagedObject
{
    public readonly resourceHandle!: IManagedResourceNode;


    public constructor
    (
        private readonly buffer: IBuffer<TCTor>,
        private readonly descriptor: SegmentedBufferDescriptor,
        wrapper: IEmscriptenWrapper<object> | null,
        owner: IManagedResourceNode | null,
    )
    {
        if (_BUILD.DEBUG)
        {
            _Debug.assert(descriptor.stride > 0, "invalid stride size");
            _Debug.assert(descriptor.blockSize > 0, "invalid block size");
        }

        if (descriptor.count === -1)
        {
            const writable = descriptor as TWriteable<SegmentedBufferDescriptor>;
            writable.count = ((buffer.getArray().length - descriptor.start) / descriptor.stride) | 0;
            writable.end = descriptor.start + descriptor.count * descriptor.stride;
        }

        if (buffer.getSharedObjectHandle() == null)
        {
            _BUILD.DEBUG && _Debug.assert(wrapper != null, "received shared object, but it was not bound");
            this.resourceHandle = wrapper!.lifecycleStrategy.createNode(owner);
        }
    }

    public getBuffer(): IBuffer<TCTor>
    {
        return this.buffer;
    }

    public getDescriptor(): SegmentedBufferDescriptor
    {
        return this.descriptor;
    }

}