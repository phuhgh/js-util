import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { SharedStaticArray, TF32SharedStaticArray } from "./shared-static-array.js";
import { SharedArray, TF32SharedArray } from "./shared-array.js";
import { IJsUtilBindings } from "../i-js-util-bindings.js";
import { _Debug } from "../../debug/_debug.js";
import utilTestModule from "../../external/util-test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { blockScopedCallback } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";

describe("=> F32SharedStaticArray", () =>
{
    let testOwner: ReferenceCountedOwner;

    beforeEach(() =>
    {
        testOwner = new ReferenceCountedOwner(false);
    });
    afterEach(() => testOwner.release());

    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());
        let sharedArray: TF32SharedArray;

        beforeAll(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        beforeEach(() =>
        {
            testModule.reset();

            _Debug.applyLabel("F32SharedStaticArray asan beforeAll", blockScopedCallback(() =>
            {
                // there isn't anything static exposed in util, avoid guessing...
                sharedArray = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8, true);
                const i = sharedArray.getInstance();
                i.set([1, 2, 3, 4, 5, 6, 7, 8]);
            }));
        });

        afterAll(() =>
        {
            testModule.endEmscriptenProgram();
        });

        describe("=> getInstance", () =>
        {
            let sharedStaticArray: TF32SharedStaticArray;

            beforeEach(blockScopedCallback(() =>
            {
                sharedStaticArray = SharedStaticArray.createOneF32(
                    testModule.wrapper,
                    testOwner.getLinkedReferences(),
                    getCArrayPtr(testModule, sharedArray) + Float32Array.BYTES_PER_ELEMENT, 4
                );
            }));

            it("| returns the expected view", _Debug.applyLabelCallback("instance test", () =>
            {
                const actualArray = sharedStaticArray.getInstance();
                expect(actualArray.length).toBe(4);
                expect(actualArray[0]).toBe(2);
                expect(actualArray[1]).toBe(3);
                expect(actualArray[2]).toBe(4);
                expect(actualArray[3]).toBe(5);
                sharedStaticArray.sharedObject.release();
                sharedArray.sharedObject.release();
            }));

            describe("=> debug mode", () =>
            {
                it(
                    "| errors when array members are accessed and memory may have resized",
                    _Debug.applyLabelCallback("resize error test", blockScopedCallback(() =>
                    {
                        const instance = sharedStaticArray.getInstance();
                        expect(instance[0]).toBe(2);
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
                        sharedStaticArray.sharedObject.release();
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

        beforeEach(() =>
        {
            testModule.reset();
        });

        describe("=> getInstance", () =>
        {
            it(
                "| returns new instance on memory growth",
                _Debug.applyLabelCallback("new instance on growth test", blockScopedCallback(() =>
                {
                    const sharedArray = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 8, true);
                    const sharedStaticArray = SharedStaticArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), getCArrayPtr(testModule, sharedArray), 8);
                    const i1 = sharedStaticArray.getInstance();
                    const sharedArray2 = SharedArray.createOneF32(testModule.wrapper, testOwner.getLinkedReferences(), 2097152, true);
                    expect(i1 === sharedStaticArray.getInstance()).toBeFalse();
                    sharedStaticArray.sharedObject.release();
                    sharedArray2.sharedObject.release();
                    sharedArray.sharedObject.release();
                }))
            );
        });
    });
});

function getCArrayPtr(testModule: SanitizedEmscriptenTestModule<IJsUtilBindings, {}>, sharedArray: TF32SharedArray)
{
    return testModule.wrapper.instance._f32SharedArray_getArrayAddress(sharedArray.sharedObject.getPtr());
}