import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "./sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import { nullPointer } from "./null-pointer.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";

describe("JsUtil::Debug", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

    describe("::Log", () =>
    {
        beforeEach(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
            _Debug.setFlag("VERBOSE", true);
        });

        afterEach(() =>
        {
            _Debug.setFlag("VERBOSE", false);
        });

        it("| logs if DEBUG_VERBOSE is true", () =>
        {
            const debugSpy = spyOn(console, "debug");
            testModule.endEmscriptenProgram();
            expect(debugSpy).toHaveBeenCalledWith("exiting program...");
        });

        it("| doesn't log if DEBUG_VERBOSE is false", () =>
        {
            _Debug.setFlag("VERBOSE", false);
            const debugSpy = spyOn(console, "debug");
            testModule.endEmscriptenProgram();
            expect(debugSpy).not.toHaveBeenCalled();
        });
    });

    describe("::Error", () =>
    {
        beforeEach(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        afterEach(() =>
        {
            testModule.endEmscriptenProgram();
        });

        it("| emits errors", () =>
        {
            expect(() => testModule.wrapper.instance._f32SharedArray_getArrayAddress(nullPointer))
                .toThrowError("expected shared array, got null ptr");
        });
    });

});

declare const console: any;