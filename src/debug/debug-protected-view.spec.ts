import { DebugProtectedView } from "./debug-protected-view";
import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../web-assembly/emscripten/sanitized-emscripten-test-module";
import asanTestModule from "../external/asan-test-module";
import { setDefaultUnitTestFlags } from "../test-util/set-default-unit-test-flags";

describe("=> DebugProtectedView", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<object, object>(asanTestModule, emscriptenAsanTestModuleOptions);

    beforeEach(async () =>
    {
        setDefaultUnitTestFlags();
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