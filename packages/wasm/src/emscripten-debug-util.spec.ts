import { IJsUtilBindings } from "./i-js-util-bindings";
import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "./emscripten/sanitized-emscripten-test-module";
import { nullPointer } from "./emscripten/null-pointer";
import { Emscripten } from "./emscripten/emscripten";
import { _Debug } from "@rc-js-util/debug";
import { resetDebugState } from "@rc-js-util/test";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../packages/emscripten/asan-test-module");

describe("JsUtil::Debug", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

    beforeEach(() => resetDebugState());

    describe("::Log", () =>
    {
        beforeEach(async () =>
        {
            await testModule.initialize();
            _Debug.setFlag("DEBUG_VERBOSE", true);
        });

        afterEach(() =>
        {
            _Debug.setFlag("DEBUG_VERBOSE", false);
        });

        test("| logs if DEBUG_VERBOSE is true", () =>
        {
            const debugSpy = spyOn(console, "debug");
            testModule.endEmscriptenProgram();
            expect(debugSpy).toHaveBeenCalledWith("exiting program...");
        });

        test("| doesn't log if DEBUG_VERBOSE is false", () =>
        {
            _Debug.setFlag("DEBUG_VERBOSE", false);
            const debugSpy = spyOn(console, "debug");
            testModule.endEmscriptenProgram();
            expect(debugSpy).not.toHaveBeenCalled();
        });
    });

    describe("::Error", () =>
    {
        beforeEach(async () =>
        {
            await testModule.initialize();
        });

        afterEach(() =>
        {
            testModule.endEmscriptenProgram();
        });

        test("| emits errors", () =>
        {
            expect(() => testModule.wrapper.instance._f32SharedArray_getArrayAddress(nullPointer))
                .toThrowError("expected shared array, got null ptr");
        });
    });

});

declare const console: any;