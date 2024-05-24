import { SharedArray, TF32SharedArray } from "./shared-array.js";
import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import utilTestModule from "../../external/util-test-module.cjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { blockScopedCallback } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";

describe("=> F32SharedArray", () =>
{
    let testOwner: ReferenceCountedOwner;

    beforeEach(() => testOwner = new ReferenceCountedOwner(false));
    afterEach(() => testOwner.release());

    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

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

            beforeEach(_Debug.applyLabelCallback("asan getInstance beforeEach", blockScopedCallback(() =>
            {
                sharedArray = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8, true);
            })));

            it("| creates an array of the correct length", _Debug.applyLabelCallback("length test", () =>
            {
                const actualArray = sharedArray.getInstance();
                expect(actualArray.length).toBe(8);
                expect(sharedArray.getInstance()).toBeInstanceOf(Float32Array);
                sharedArray.sharedObject.release();
            }));

            it("| throws an exception if there isn't enough memory", _Debug.applyLabelCallback("OOM exception", () =>
            {
                sharedArray.sharedObject.release();
                expect(
                    blockScopedCallback(() =>
                        {
                            SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 0xffffffff);
                        }
                    )).toThrowError("Failed to allocate memory for shared array.");
            }));

            describe("=> debug mode", () =>
            {
                it("| errors when called after release", _Debug.applyLabelCallback("error after release", () =>
                {
                    sharedArray.sharedObject.release();
                    expect(() => sharedArray.getInstance()).toThrow();
                }));

                it(
                    "| errors when array members are accessed after release",
                    _Debug.applyLabelCallback("error post release member access", () =>
                    {
                        sharedArray.sharedObject.release();
                        expect(() => sharedArray.getInstance().length).toThrow();
                    })
                );

                it(
                    "| errors when array members are accessed and memory may have resized",
                    _Debug.applyLabelCallback("error invalidated view member access", blockScopedCallback(() =>
                    {
                        const instance = sharedArray.getInstance();
                        expect(instance[0]).toBe(0);
                        const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8);

                        if (testModule.wrapper.instance._isDebugBuild())
                        {
                            expect(() => instance[0]).toThrow();
                        }
                        else
                        {
                            expect(() => instance[0]).not.toThrow();
                        }

                        sharedArray2.sharedObject.release();
                        sharedArray.sharedObject.release();
                    }))
                );
            });
        });
    });

    describe("=> safe heap tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

        beforeAll(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        describe("=> getInstance", () =>
        {
            it(
                "| returns new instance on memory growth",
                _Debug.applyLabelCallback("new instance on resize", blockScopedCallback(() =>
                {
                    const sharedArray = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8);
                    const i1 = sharedArray.getInstance();
                    const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 2097152);
                    expect(i1 === sharedArray.getInstance()).toBeFalse();
                    sharedArray.sharedObject.release();
                    sharedArray2.sharedObject.release();
                }))
            );
        });
    });
});