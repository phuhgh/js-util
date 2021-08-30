import { Emscripten } from "../../../external/emscripten";
import { SharedArray, TF32SharedArray } from "./shared-array";
import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { applyLabel, debugDescribe, debugIt } from "../../test-utils";
import { IJsUtilBindings } from "../i-js-util-bindings";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../../external/asan-test-module");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const safeHeapTestModule = require("../../../external/safe-heap-test-module");

debugDescribe("=> F32SharedArray", () =>
{
    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        afterAll(() =>
        {
            testModule.endEmscriptenProgram();
        });

        describe("=> getInstance", () =>
        {
            let sharedArray: TF32SharedArray;

            beforeEach(() =>
            {
                applyLabel("asan getInstance beforeEach", () =>
                {
                    sharedArray = SharedArray.createOneF32(testModule.wrapper, 8, true);
                });
            });

            debugIt("| creates an array of the correct length", () =>
            {
                const actualArray = sharedArray.getInstance();
                expect(actualArray.length).toBe(8);
                expect(sharedArray.getInstance()).toBeInstanceOf(Float32Array);
                sharedArray.sharedObject.release();
            });

            debugIt("| throws an exception if there isn't enough memory", () =>
            {
                sharedArray.sharedObject.release();
                expect(() => SharedArray.createOneF32(testModule.wrapper, 0xffffffff)).toThrowError("Failed to allocate memory for shared array.");
            });

            describe("=> debug mode", () =>
            {
                debugIt("| errors when called after release", () =>
                {
                    sharedArray.sharedObject.release();
                    expect(() => sharedArray.getInstance()).toThrow();
                });

                debugIt("| errors when array members are accessed after release", () =>
                {
                    sharedArray.sharedObject.release();
                    expect(() => sharedArray.getInstance().length).toThrow();
                });

                debugIt("| errors when array members are accessed and memory may have resized", () =>
                {
                    const instance = sharedArray.getInstance();
                    expect(instance[0]).toBe(0);
                    const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, 8);
                    expect(() => instance[0]).toThrow();
                    sharedArray2.sharedObject.release();
                    sharedArray.sharedObject.release();
                });
            });
        });
    });

    describe("=> safe stack tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(safeHeapTestModule, emscriptenSafeHeapTestModuleOptions);

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        describe("=> getInstance", () =>
        {
            debugIt("| returns new instance on memory growth", () =>
            {
                const sharedArray = SharedArray.createOneF32(testModule.wrapper, 8);
                const i1 = sharedArray.getInstance();
                const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, 2097152);
                expect(i1 === sharedArray.getInstance()).toBeFalse();
                sharedArray.sharedObject.release();
                sharedArray2.sharedObject.release();
            });
        });
    });
});