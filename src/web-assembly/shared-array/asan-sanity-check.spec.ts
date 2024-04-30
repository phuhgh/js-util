import { emscriptenTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import utilTestModule from "../../external/util-test-module.cjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> asan sanity check", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, emscriptenTestModuleOptions);

    beforeAll(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    it("| throws when the program ends and memory has not been released", () =>
    {
        _Debug.applyLabel("sanity check - end program", () =>
        {
            const address = testModule.wrapper.instance._malloc(12);
            testModule.wrapper.instance._free(address);
            expect(() => testModule.wrapper.instance._free(address));
        });
    });
});