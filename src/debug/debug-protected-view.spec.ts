import { DebugProtectedView } from "./debug-protected-view.js";
import { SanitizedEmscriptenTestModule } from "../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import utilTestModule from "../external/util-test-module.cjs";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../test-util/test-utils.js";

describe("=> DebugProtectedView", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<object, object>(utilTestModule, getTestModuleOptions());

    beforeEach(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });


    describe("unwrapProtectedView", () =>
    {
        describe("=> when valid", () =>
        {
            it("| returns the original object", () =>
            {
                const protectedView = new DebugProtectedView(testModule.wrapper, "");
                const thingToBeProtected = { foo: true };
                const protectedThing = protectedView.createProtectedView(thingToBeProtected);
                expect(protectedThing).not.toBe(thingToBeProtected);
                expect(DebugProtectedView.unwrapProtectedView(protectedThing)).toBe(thingToBeProtected);
            });
        });

        describe("=> when the view has been invalidated", () =>
        {
            it("| it errors", () =>
            {
                const protectedView = new DebugProtectedView(testModule.wrapper, "meep meep");
                const thingToBeProtected = { foo: true };
                const protectedThing = protectedView.createProtectedView(thingToBeProtected);
                protectedView.invalidate();
                expect(() => DebugProtectedView.unwrapProtectedView(protectedThing)).toThrowError("ProtectedView view invalidated - meep meep");
            });
        });

        describe("=> when given not a proxy", () =>
        {
            it("| it returns the thing", () =>
            {
                const thing = { foo: true };
                expect(DebugProtectedView.unwrapProtectedView(thing)).toBe(thing);
            });
        });
    });
});