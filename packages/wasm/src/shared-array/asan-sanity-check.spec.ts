import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { IJsUtilBindings } from "../i-js-util-bindings";
import { Emscripten } from "../emscripten/emscripten";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../../packages/emscripten/asan-test-module");

describe("=> asan sanity check", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

    beforeAll(async () =>
    {
        await testModule.initialize();
    });

    it("| throws when the program ends and memory has not been released", async () =>
    {
        const address = testModule.wrapper.instance._malloc(12);
        testModule.wrapper.instance._free(address);
        expect(() => testModule.wrapper.instance._free(address));
    });
});