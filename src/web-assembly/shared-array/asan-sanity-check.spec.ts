import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { _Debug } from "../../debug/_debug";
import asanTestModule from "../../external/asan-test-module";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags";


describe("=> asan sanity check", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

    beforeAll(async () =>
    {
        setDefaultUnitTestFlags();
        await testModule.initialize();
    });

    it("| throws when the program ends and memory has not been released", async () =>
    {
        _Debug.applyLabel("sanity check - end program", () =>
        {
            const address = testModule.wrapper.instance._malloc(12);
            testModule.wrapper.instance._free(address);
            expect(() => testModule.wrapper.instance._free(address));
        });
    });
});