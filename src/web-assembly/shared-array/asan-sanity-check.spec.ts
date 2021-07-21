import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { SharedArray, TF32SharedArray } from "./shared-array";
import { applyLabel, debugIt } from "../../test-utils";
import { Emscripten } from "../../../external/emscripten";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../../external/asan-test-module");

describe("=> asan sanity check", () =>
{
    const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);
    let leakedShared: TF32SharedArray;

    beforeAll(async () =>
    {
        await testModule.initialize();

        applyLabel("asan sanity check beforeEach", () =>
        {
            leakedShared = SharedArray.createOneF32(testModule.wrapper, 8, true);
            const shared = SharedArray.createOneF32(testModule.wrapper, 8, true);
            shared.pointer.release();
            // oh noes, we missed one
        });
    });

    debugIt("| throws when the program ends and memory has not been released", async () =>
    {
        expect(() => testModule.endEmscriptenProgram()).toThrow();
        leakedShared.pointer.release();
    });
});