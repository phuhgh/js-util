import { Emscripten } from "../../../external/emscripten";
import { emscriptenAsanTestModuleOptions, emscriptenSafeStackTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module";
import { SharedStaticArray, TSharedStaticArrayF32 } from "./shared-static-array";
import { SharedArray, TSharedArrayF32 } from "./shared-array";
import { applyLabel, debugDescribe, debugIt } from "../../test-utils";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../../external/asan-test-module");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const safeStackTestModule = require("../../../external/safe-heap-test-module");

debugDescribe("=> F32SharedStaticArray", () =>
{
    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);
        let sharedArray: TSharedArrayF32;

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
            let sharedStaticArray: TSharedStaticArrayF32;

            beforeEach(() =>
            {
                sharedStaticArray = SharedStaticArray.createOneF32(testModule.wrapper, getCArrayPtr(testModule, sharedArray) + Float32Array.BYTES_PER_ELEMENT, 4);
            });

            debugIt("| returns the expected view", () =>
            {
                const actualArray = sharedStaticArray.getInstance();
                expect(actualArray.length).toBe(4);
                expect(actualArray[0]).toBe(2);
                expect(actualArray[1]).toBe(3);
                expect(actualArray[2]).toBe(4);
                expect(actualArray[3]).toBe(5);
                sharedStaticArray.release();
                sharedArray.release();
            });

            describe("=> debug mode", () =>
            {
                debugIt("| errors when array members are accessed and memory may have resized", () =>
                {
                    const instance = sharedStaticArray.getInstance();
                    expect(instance[0]).toBe(2);
                    const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, 8);
                    expect(() => instance[0]).toThrow();
                    sharedArray2.release();
                    sharedStaticArray.release();
                    sharedArray.release();
                });
            });
        });
    });

    describe("=> safe stack tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(safeStackTestModule, emscriptenSafeStackTestModuleOptions);

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        describe("=> getInstance", () =>
        {
            debugIt("| returns new instance on memory growth", () =>
            {
                const sharedArray = SharedArray.createOneF32(testModule.wrapper, 8, true);
                const sharedStaticArray = SharedStaticArray.createOneF32(testModule.wrapper, getCArrayPtr(testModule, sharedArray), 8);
                const i1 = sharedStaticArray.getInstance();
                const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, 2097152, true);
                expect(i1 === sharedStaticArray.getInstance()).toBeFalse();
                sharedStaticArray.release();
                sharedArray2.release();
                sharedArray.release();
            });
        });
    });
});

function getCArrayPtr(testModule: SanitizedEmscriptenTestModule, sharedArray: TSharedArrayF32)
{
    return testModule.wrapper.instance._f32SharedArray_getArrayAddress(sharedArray.getPtr());
}