import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper";

/**
 * @public
 * Defines utility methods for creating typed array tuples.
 */
export interface ITypedArrayTupleFactory<TBuffer, TCtorArgs extends number[]>
{
    createOne(...args: TCtorArgs): TBuffer;
    createOneReusingBuffer(wrapper: IEmscriptenWrapper, pointerToStatic: number): TBuffer;

    createOneEmpty(): TBuffer;

    copyFromBuffer
    (
        bufferView: DataView,
        pointer: number,
        writeTo?: TBuffer,
        littleEndian?: boolean,
    )
        : TBuffer;

    copyToBuffer
    (
        bufferView: DataView,
        writeFrom: TBuffer,
        pointer: number,
        littleEndian?: boolean,
    )
        : void;
}