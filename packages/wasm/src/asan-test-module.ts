import { Emscripten } from "./emscripten/emscripten";
import { IJsUtilBindings } from "./i-js-util-bindings";

/**
 * @internal
 */
declare const Module: Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
/**
 * @internal
 */
export default Module;
