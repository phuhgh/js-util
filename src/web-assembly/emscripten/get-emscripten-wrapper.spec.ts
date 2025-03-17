import { SanitizedEmscriptenTestModule } from "./sanitized-emscripten-test-module.js";
import utilTestModule from "../../external/test-module.mjs";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { IdCategory, IdSpecialization, numberCategory, numberSpecializations } from "../../runtime/rtti-interop.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { IJsUtilBindings } from "../i-js-util-bindings.js";
import type { ITestOnlyBindings } from "../i-test-only-bindings.js";
import { SharedArray } from "../shared-array/shared-array.js";
import { _Fp } from "../../fp/_fp.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";

describe("=> getEmscriptenWrapper", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<IJsUtilBindings, ITestOnlyBindings>(
        utilTestModule,
        getTestModuleOptions(),
    );

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

        it("| supports using categories as flags", _Fp.runWithin([blockScope], () =>
        {
            testModule.wrapper.instance.setTestCategoryFlag();
            const testFlagId = new IdSpecialization(new IdCategory("TEST_CAT_FLAG"), "TEST_CAT_FLAG");
            // this needs updating whenever new categories are added...
            expect(testModule.wrapper.interopIds.getId(testFlagId)).toBe(4);
            const sa = SharedArray.createOne(testModule.wrapper, Float32Array, null, 16);
            testModule.wrapper.interopIds.setSpecializations(sa, [testFlagId]);
            expect(testModule.wrapper.interopIds.hasId(sa, testFlagId)).toBe(true);
        }));
    });
});
