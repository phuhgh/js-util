import type { IMemoryUtilBindings } from "./i-memory-util-bindings.js";
import type { IEmscriptenBindings } from "./i-emscripten-bindings.js";
import type { IDebugBindings } from "./i-debug-bindings.js";

/**
 * @public
 */
export interface IInteropBindings extends IMemoryUtilBindings, IEmscriptenBindings, IDebugBindings
{
    // special convention, anything which starts _jsuInitialize* will be called on module initialization
    // these should never rely on call order...
    _jsuInitializeSelf(): boolean;

    _jsUtilAddRuntimeMappings(count: number, o_sharedObjectPtr: number): number;
    _jsUtilRemoveRuntimeMappings(ptr: number, o_sharedObjectPtr: number): void;
    _jsUtilGetRuntimeMappingAddress(): number;
    _jsUtilHasRuntimeMappingId(sharedObjectPtr: number, catId: number, specId: number): boolean;
    _jsUtilGetRuntimeMappingId(namePtr: number): number;
}
