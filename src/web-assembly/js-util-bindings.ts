import { ISharedArrayBindings } from "./shared-array/i-shared-array-bindings";
import { IMemoryUtilBindings } from "./emscripten/i-memory-util-bindings";
import { IDebugBindings } from "./emscripten/i-debug-bindings";

/**
 * @public
 */
export interface JsUtilBindings
    extends ISharedArrayBindings,
            IMemoryUtilBindings,
            IDebugBindings
{
}