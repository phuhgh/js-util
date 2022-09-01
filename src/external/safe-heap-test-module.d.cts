import { Emscripten } from "./emscripten.js";
import { IJsUtilBindings } from "../index.js";

/**
 * @internal
 */
declare const Module: Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
/**
 * @internal
 */
export = Module;
