import { ATypedArrayTuple } from "./a-typed-array-tuple.js";
import { TTypedArray } from "./t-typed-array.js";
import type { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import type { EVectorIdentifier, ISharedVectorBindings } from "../../web-assembly/resizable-array/i-shared-vector-bindings.js";
import { IEmscriptenWrapper } from "../../web-assembly/emscripten/i-emscripten-wrapper.js";
import type { IManagedResourceNode } from "../../lifecycle/manged-resources.js";
import type { ITypedArrayTuple } from "../../web-assembly/shared-array/typed-array-tuple.js";

/**
 * @public
 * Defines utility methods for creating typed array tuples.
 */
export interface ITypedArrayTupleFactory<TArray extends ATypedArrayTuple<number, TTypedArray>, TCtorArgs extends number[]>
{
    readonly byteSize: number;
    readonly numberId: ENumberIdentifier;
    readonly vectorId: EVectorIdentifier;
    readonly elementCount: number;
    createOne(...args: TCtorArgs): TArray;
    createOneEmpty(): TArray;

    createShared(wrapper: IEmscriptenWrapper<ISharedVectorBindings>, owner: IManagedResourceNode | null): ITypedArrayTuple<TArray>;
}
