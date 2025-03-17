import { SanitizedEmscriptenTestModule } from "./sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import { nullPtr } from "./null-pointer.js";
import utilTestModule from "../../external/test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { ENumberIdentifier } from "../../runtime/rtti-interop.js";
import { _Fp } from "../../fp/_fp.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";
import { SharedArray } from "../shared-array/shared-array.js";
import stringMatching = jasmine.stringMatching;

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

        it("| correctly handles tags", _Fp.runWithin([blockScope], () =>
        {
            _Debug.setDisabledLoggingTags([]);
            const debugSpy = spyOn(console, "debug");
            const sa = SharedArray.createOne(testModule.wrapper, Float32Array, null, 16);
            expect(sa.resourceHandle.getIsDestroyed()).toBe(false);
            expect(debugSpy).toHaveBeenCalled();
            if (testModule.wrapper.instance._isDebugBuild())
            {
                expect(debugSpy.calls.first().args[0]).toEqual(stringMatching(/\[WASM, MEMORY, ALLOCATIONS, CPP] Created SharedMemoryOwner:/));
            }
            else
            {
                // the C++ logging was conditionally compiled out...
                expect(debugSpy.calls.first().args[0]).toEqual(stringMatching(/\[WASM, MEMORY] JS points to \(NON-OWNING\) SharedBufferView/));
            }
        }));
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