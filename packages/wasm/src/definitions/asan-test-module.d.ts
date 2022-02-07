import { Emscripten } from "../emscripten/emscripten";
import { IJsUtilBindings } from "../i-js-util-bindings";

declare module "asan-test-module"
{
    const asanModule: Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
}
