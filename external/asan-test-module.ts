import { Emscripten } from "./emscripten";
import { IJsUtilBindings } from "../src";

/**
 * @internal
 */
declare const Module: Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
/**
 * @internal
 */
export default Module;
