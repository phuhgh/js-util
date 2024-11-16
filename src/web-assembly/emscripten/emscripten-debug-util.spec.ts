import { SanitizedEmscriptenTestModule } from "./sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import { nullPtr } from "./null-pointer.js";
import utilTestModule from "../../external/util-test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { ENumberIdentifier } from "../../runtime/rtti-interop.js";

describe("JsUtil::Debug", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    describe("::Log", () =>
    {
        beforeEach(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
            _Debug.setFlag("VERBOSE", true);
            _Debug.setDisabledLoggingTags(["MEMORY"]); // disable allocation tracking
        });

        afterEach(() =>
        {
            _Debug.setFlag("VERBOSE", false);
            _Debug.setDisabledLoggingTags([]);
        });

        it("| logs if DEBUG_VERBOSE is true", () =>
        {
            const debugSpy = spyOn(console, "debug");
            const isDebug = testModule.wrapper.instance._isDebugBuild();
            testModule.endEmscriptenProgram();

            if (isDebug)
            {
                expect(debugSpy).toHaveBeenCalledWith("[WASM] exiting program...");
            }
            else
            {
                expect(debugSpy).not.toHaveBeenCalled();
            }
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
            if (testModule.wrapper.instance._isDebugBuild())
            {
                expect(() => testModule.wrapper.instance._sharedArray_getDataAddress(ENumberIdentifier.F32, nullPtr))
                    .toThrowError("expected shared array, got null ptr");

            }
            else
            {
                expect(() => testModule.wrapper.instance._sharedArray_getDataAddress(ENumberIdentifier.F32, nullPtr))
                    .not.toThrowError("expected shared array, got null ptr");
            }

        });
    });

});

declare const console: any;