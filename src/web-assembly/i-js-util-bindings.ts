import { ISharedArrayBindings } from "./shared-array/i-shared-array-bindings.js";
import { IMemoryUtilBindings } from "./emscripten/i-memory-util-bindings.js";
import { IDebugBindings } from "./emscripten/i-debug-bindings.js";

/**
 * @public
 */
export interface IJsUtilBindings
    extends ISharedArrayBindings,
            IMemoryUtilBindings,
            IDebugBindings
{
}