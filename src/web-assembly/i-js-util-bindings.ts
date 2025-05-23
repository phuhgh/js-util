import type { ISharedArrayBindings } from "./shared-array/i-shared-array-bindings.js";
import type { IWorkerPoolBindings } from "./worker-pool/i-worker-pool-bindings.js";
import type { IResizableArrayBindings } from "./resizable-array/i-resizable-array-bindings.js";
import type { ISharedVectorBindings } from "./resizable-array/i-shared-vector-bindings.js";

/**
 * @public
 */
export interface IJsUtilBindings
    extends ISharedArrayBindings,
            IResizableArrayBindings,
            IWorkerPoolBindings,
            ISharedVectorBindings
{
}
