import { SanitizedEmscriptenTestModule } from "./sanitized-emscripten-test-module.js";
import utilTestModule from "../../external/test-module.mjs";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { numberCategory, numberSpecializations } from "../../runtime/rtti-interop.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("=> getEmscriptenWrapper", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    afterEach(() => testModule.endEmscriptenProgram());

    describe("=> interopIds", () =>
    {
        it("| gets the C++ id", () =>
        {
            expect(testModule.wrapper.interopIds.getId(numberCategory)).toBeGreaterThan(-1);
            expect(testModule.wrapper.interopIds.getId(numberSpecializations.f64)).toBe(10);
        });
    });
});

declare const console: any;