import { TTypedArrayCtor } from "../t-typed-array-ctor.js";
import { INormalizedDataView } from "./i-normalized-data-view.js";
import { Float64DataView } from "./float64-data-view.js";
import { Float32DataView } from "./float32-data-view.js";
import { Int32DataView } from "./int32-data-view.js";
import { Uint32DataView } from "./uint32-data-view.js";
import { Int16DataView } from "./int16-data-view.js";
import { Uint16DataView } from "./uint16-data-view.js";
import { Int8DataView } from "./int8-data-view.js";
import { Uint8DataView } from "./uint8-data-view.js";
import { Uint8ClampedDataView } from "./uint8-clamped-data-view.js";

/**
 * @public
 * Provides {@link INormalizedDataView}.
 */
export class NormalizedDataViewProvider
{
    public static getView(typedArrayCtor: TTypedArrayCtor): INormalizedDataView
    {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return NormalizedDataViewProvider.views.get(typedArrayCtor)!;
    }

    private static readonly views = new Map<TTypedArrayCtor, INormalizedDataView>([
        [Float64Array, new Float64DataView()],
        [Float32Array, new Float32DataView()],
        [Int32Array, new Int32DataView()],
        [Uint32Array, new Uint32DataView()],
        [Int16Array, new Int16DataView()],
        [Uint16Array, new Uint16DataView()],
        [Int8Array, new Int8DataView()],
        [Uint8Array, new Uint8DataView()],
        [Uint8ClampedArray, new Uint8ClampedDataView()],
    ]);

    // noinspection JSUnusedLocalSymbols
    private constructor()
    {
    }
}