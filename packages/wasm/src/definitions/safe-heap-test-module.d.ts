import { Emscripten } from "../emscripten/emscripten";
import { IJsUtilBindings } from "../i-js-util-bindings";

declare module "safe-heap-test-module"
{
    const safeHeapModule: Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
}