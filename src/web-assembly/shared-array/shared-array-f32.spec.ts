import { SharedArray, TF32SharedArray } from "./shared-array.js";
import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import safeHeapTestModule from "../../external/safe-heap-test-module.cjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { blockScopedLifecycle } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";

describe("=> F32SharedArray", () =>
{
    let testOwner: ReferenceCountedOwner;

    beforeEach(() => testOwner = new ReferenceCountedOwner(false));
    afterEach(() => testOwner.release());

    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

        beforeAll(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        beforeEach(() =>
        {
            testModule.reset();
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
                _Debug.applyLabel("asan getInstance beforeEach", () =>
                {
                    blockScopedLifecycle(() =>
                    {
                        sharedArray = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8, true);
                    });
                });
            });

            it("| creates an array of the correct length", () =>
            {
                _Debug.applyLabel("length test", () =>
                {
                    const actualArray = sharedArray.getInstance();
                    expect(actualArray.length).toBe(8);
                    expect(sharedArray.getInstance()).toBeInstanceOf(Float32Array);
                    sharedArray.sharedObject.release();
                });
            });

            it("| throws an exception if there isn't enough memory", () =>
            {
                _Debug.applyLabel("OOM exception", () =>
                {
                    sharedArray.sharedObject.release();
                    expect(() =>
                    {
                        blockScopedLifecycle(() =>
                        {
                            SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 0xffffffff);
                        });
                    }).toThrowError("Failed to allocate memory for shared array.");
                });
            });

            describe("=> debug mode", () =>
            {
                it("| errors when called after release", () =>
                {
                    _Debug.applyLabel("error after release", () =>
                    {
                        sharedArray.sharedObject.release();
                        expect(() => sharedArray.getInstance()).toThrow();
                    });
                });

                it("| errors when array members are accessed after release", () =>
                {
                    _Debug.applyLabel("error post release member access", () =>
                    {
                        sharedArray.sharedObject.release();
                        expect(() => sharedArray.getInstance().length).toThrow();
                    });
                });

                it("| errors when array members are accessed and memory may have resized", () =>
                {
                    _Debug.applyLabel("error invalidated view member access", () =>
                    {
                        blockScopedLifecycle(() =>
                        {
                            const instance = sharedArray.getInstance();
                            expect(instance[0]).toBe(0);
                            const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8);
                            expect(() => instance[0]).toThrow();
                            sharedArray2.sharedObject.release();
                            sharedArray.sharedObject.release();
                        });
                    });
                });
            });
        });
    });

    describe("=> safe stack tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(safeHeapTestModule, emscriptenSafeHeapTestModuleOptions);

        beforeAll(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        describe("=> getInstance", () =>
        {
            it("| returns new instance on memory growth", () =>
            {
                _Debug.applyLabel("new instance on resize", () =>
                {
                    blockScopedLifecycle(() =>
                    {
                        const sharedArray = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8);
                        const i1 = sharedArray.getInstance();
                        const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 2097152);
                        expect(i1 === sharedArray.getInstance()).toBeFalse();
                        sharedArray.sharedObject.release();
                        sharedArray2.sharedObject.release();
                    });
                });
            });
        });
    });
});