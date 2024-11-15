import { SharedArray } from "./shared-array.js";
import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import utilTestModule from "../../external/util-test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { fpRunWithin } from "../../fp/impl/fp-run-within.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";

describe("=> F32SharedArray", () =>
{
    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

        beforeEach(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        afterEach(() =>
        {
            testModule.endEmscriptenProgram();
        });

        describe("=> getInstance", () =>
        {
            let sharedArray: SharedArray<Float32ArrayConstructor>;

            beforeEach(fpRunWithin([_Debug.labelBlock("TestSetup")], () =>
            {
                sharedArray = SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8, true);
            }));
            afterEach(() =>
            {
                testModule.wrapper.rootNode.getLinked().unlink(sharedArray.resourceHandle);
            });

            it("| creates an array of the correct length", fpRunWithin([_Debug.labelBlock("LengthTest")], () =>
            {
                const actualArray = sharedArray.getInstance();
                expect(actualArray.length).toBe(8);
                expect(sharedArray.getInstance()).toBeInstanceOf(Float32Array);
            }));

            it("| throws an exception if there isn't enough memory", fpRunWithin([_Debug.labelBlock("OOMTest"), blockScope], () =>
            {
                testModule.wrapper.rootNode.getLinked().unlink(sharedArray.resourceHandle);
                expect(
                    () => SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 0xffffffff)
                ).toThrowError("Failed to allocate memory for shared array.");
            }));

            describe("=> debug mode", () =>
            {
                it("| errors when called after release", fpRunWithin([_Debug.labelBlock("ErrorAfterReleaseTest")], () =>
                {
                    testModule.wrapper.rootNode.getLinked().unlink(sharedArray.resourceHandle);
                    expect(() => sharedArray.getInstance()).toThrow();
                }));

                it(
                    "| errors when array members are accessed after release",
                    fpRunWithin([_Debug.labelBlock("UseAfterFree")], () =>
                    {
                        const instance = sharedArray.getInstance();
                        testModule.wrapper.rootNode.getLinked().unlink(sharedArray.resourceHandle);
                        expect(() => instance.length).toThrow();
                    })
                );

                it(
                    "| errors when array members are accessed and memory may have resized",
                    fpRunWithin([blockScope, _Debug.labelBlock("InvalidatedMemoryTest")], () =>
                    {
                        const instance = sharedArray.getInstance();
                        expect(instance[0]).toBe(0);
                        const sharedArray2 = SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8);

                        if (testModule.wrapper.instance._isDebugBuild())
                        {
                            expect(() => instance[0]).toThrow();
                        }
                        else
                        {
                            expect(() => instance[0]).not.toThrow();
                        }

                        testModule.wrapper.rootNode.getLinked().unlink(sharedArray.resourceHandle);
                        testModule.wrapper.rootNode.getLinked().unlink(sharedArray2.resourceHandle);
                    })
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
            it("| returns new instance on memory growth", fpRunWithin([blockScope, _Debug.labelBlock("ResizeTest")], () =>
            {
                const sharedArray = SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8);
                const i1 = sharedArray.getInstance();
                const sharedArray2 = SharedArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 2097152);
                expect(i1 === sharedArray.getInstance()).toBeFalse();

                testModule.wrapper.rootNode.getLinked().unlink(sharedArray.resourceHandle);
                testModule.wrapper.rootNode.getLinked().unlink(sharedArray2.resourceHandle);
            }));
        });
    });
});