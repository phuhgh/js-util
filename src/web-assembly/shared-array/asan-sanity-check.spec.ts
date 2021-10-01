import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { debugIt } from "../../test-utils";
import { Emscripten } from "../../../external/emscripten";
import { IJsUtilBindings } from "../i-js-util-bindings";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../../external/asan-test-module");

describe("=> asan sanity check", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

    beforeAll(async () =>
    {
        await testModule.initialize();
    });

    debugIt("| throws when the program ends and memory has not been released", async () =>
    {
        const address = testModule.wrapper.instance._malloc(12);
        testModule.wrapper.instance._free(address);
        expect(() => testModule.wrapper.instance._free(address));
    });
});