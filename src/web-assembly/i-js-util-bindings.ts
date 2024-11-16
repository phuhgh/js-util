import type { ISharedArrayBindings } from "./shared-array/i-shared-array-bindings.js";
import type { IMemoryUtilBindings } from "./emscripten/i-memory-util-bindings.js";
import type { IDebugBindings } from "./emscripten/i-debug-bindings.js";
import type { IEmscriptenBindings } from "./emscripten/i-emscripten-bindings.js";
import type { IWorkerPoolBindings } from "./worker-pool/i-worker-pool-bindings.js";
import type { IInteropBindings } from "./emscripten/i-interop-bindings.js";
import type { IResizableArrayBindings } from "./resizable-array/i-resizable-array-bindings.js";

/**
 * @public
 */
export interface IJsUtilBindings
    extends ISharedArrayBindings,
            IResizableArrayBindings,
            IMemoryUtilBindings,
            IInteropBindings,
            IDebugBindings,
            IEmscriptenBindings,
            IWorkerPoolBindings
{
    _isDebugBuild(): boolean;

    // special convention, anything which starts _jsuInitialize* will be called on module initialization
    // these should never rely on call order...
    _jsuInitializeSelf(): boolean;
}
