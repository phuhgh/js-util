import type { TTypedArrayCtor } from "../array/typed-array/t-typed-array-ctor.js";

export interface ISegmentedBufferDescriptor
{
    getCount(): number;
    getStart(): number;
    getEnd(): number;

    getBlockSize(): number;
    getBlockByteSize(): number;
}

/**
 * @public
 * todo jack: docs, impl
 */
export interface ISegmentedBufferView<TCtor extends TTypedArrayCtor>
{
    getView(): InstanceType<TCtor>;
    getDescriptor(): ISegmentedBufferDescriptor;
}
