import { Emscripten } from "./emscripten";
import { JsUtilBindings } from "../src";

/**
 * @internal
 */
declare const Module: Emscripten.EmscriptenModuleFactory<JsUtilBindings>;
/**
 * @internal
 */
export default Module;
