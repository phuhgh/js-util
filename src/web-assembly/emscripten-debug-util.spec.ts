import { Emscripten } from "../../external/emscripten";
import { IJsUtilBindings } from "./i-js-util-bindings";
import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "./emscripten/sanitized-emscripten-test-module";
import { _Debug } from "../debug/_debug";
import { nullPointer } from "./emscripten/null-pointer";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../external/asan-test-module");

describe("JsUtil::Debug", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

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

        it("| logs if DEBUG_VERBOSE is true", () =>
        {
            const debugSpy = spyOn(console, "debug");
            testModule.endEmscriptenProgram();
            expect(debugSpy).toHaveBeenCalledWith("exiting program...");
        });

        it("| doesn't log if DEBUG_VERBOSE is false", () =>
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

        it("| emits errors", () =>
        {
            expect(() => testModule.wrapper.instance._f32SharedArray_getArrayAddress(nullPointer))
                .toThrowError("expected shared array, got null ptr");
        });
    });

});

declare const console: any;