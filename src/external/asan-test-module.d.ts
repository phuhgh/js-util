import { Emscripten } from "./emscripten";
import { IJsUtilBindings } from "../index";

/**
 * @internal
 */
declare const Module: Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
/**
 * @internal
 */
export = Module;
