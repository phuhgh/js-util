import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import utilTestModule from "../../external/test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { fpRunWithin } from "../../fp/impl/fp-run-within.js";

describe("=> asan sanity check", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    beforeAll(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    it(
        "| throws when the program ends and memory has not been released",
        fpRunWithin([_Debug.labelBlock("sanity check - end program")], () =>
        {
            const address = testModule.wrapper.instance._malloc(12);
            testModule.wrapper.instance._free(address);
            expect(() => testModule.wrapper.instance._free(address));
        })
    );
});