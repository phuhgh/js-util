import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { SharedStaticArray, TF32SharedStaticArray } from "./shared-static-array";
import { SharedArray, TF32SharedArray } from "./shared-array";
import { IJsUtilBindings } from "../i-js-util-bindings";
import { applyLabel, resetDebugState } from "@rc-js-util/test";
import { Emscripten } from "../emscripten/emscripten";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<IJsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../../packages/emscripten/asan-test-module");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const safeHeapTestModule = require("../../../packages/emscripten/safe-heap-test-module");

describe("=> F32SharedStaticArray", () =>
{
    beforeEach(() => resetDebugState());

    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);
        let sharedArray: TF32SharedArray;

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        beforeEach(() =>
        {
            applyLabel("F32SharedStaticArray asan beforeAll", () =>
            {
                // there isn't anything static exposed in util, avoid guessing...
                sharedArray = SharedArray.createOneF32(testModule.wrapper, 8, true);
                const i = sharedArray.getInstance();
                i.set([1, 2, 3, 4, 5, 6, 7, 8]);
            });
        });

        afterAll(() =>
        {
            testModule.endEmscriptenProgram();
        });

        describe("=> getInstance", () =>
        {
            let sharedStaticArray: TF32SharedStaticArray;

            beforeEach(() =>
            {
                sharedStaticArray = SharedStaticArray.createOneF32(testModule.wrapper, getCArrayPtr(testModule, sharedArray) + Float32Array.BYTES_PER_ELEMENT, 4);
            });

            it("| returns the expected view", () =>
            {
                const actualArray = sharedStaticArray.getInstance();
                expect(actualArray.length).toBe(4);
                expect(actualArray[0]).toBe(2);
                expect(actualArray[1]).toBe(3);
                expect(actualArray[2]).toBe(4);
                expect(actualArray[3]).toBe(5);
                sharedStaticArray.sharedObject.release();
                sharedArray.sharedObject.release();
            });

            describe("=> debug mode", () =>
            {
                it("| errors when array members are accessed and memory may have resized", () =>
                {
                    const instance = sharedStaticArray.getInstance();
                    expect(instance[0]).toBe(2);
                    const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, 8);
                    expect(() => instance[0]).toThrow();
                    sharedArray2.sharedObject.release();
                    sharedStaticArray.sharedObject.release();
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
            it("| returns new instance on memory growth", () =>
            {
                const sharedArray = SharedArray.createOneF32(testModule.wrapper, 8, true);
                const sharedStaticArray = SharedStaticArray.createOneF32(testModule.wrapper, getCArrayPtr(testModule, sharedArray), 8);
                const i1 = sharedStaticArray.getInstance();
                const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, 2097152, true);
                expect(i1 === sharedStaticArray.getInstance()).toBe(false);
                sharedStaticArray.sharedObject.release();
                sharedArray2.sharedObject.release();
                sharedArray.sharedObject.release();
            });
        });
    });
});

function getCArrayPtr(testModule: SanitizedEmscriptenTestModule<IJsUtilBindings, {}>, sharedArray: TF32SharedArray)
{
    return testModule.wrapper.instance._f32SharedArray_getArrayAddress(sharedArray.sharedObject.getPtr());
}
