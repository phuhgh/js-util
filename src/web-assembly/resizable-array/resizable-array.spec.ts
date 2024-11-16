import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { _Debug } from "../../debug/_debug.js";
import utilTestModule from "../../external/util-test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";
import { fpRunWithin } from "../../fp/impl/fp-run-within.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";
import type { TTypedArrayCtor } from "../../array/typed-array/t-typed-array-ctor.js";
import { getNumberSpecialization, numberSpecializations } from "../../runtime/rtti-interop.js";
import { ResizableArray, resizableArraySpecialization } from "./resizable-array.js";
import type { ISharedArray } from "../shared-array/i-shared-array.js";

describe("=> ResizableArray", () =>
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

    describe("=> type construction", () =>
    {
        it("| creates an array of the correct length", fpRunWithin([blockScope, _Debug.labelBlock("construction")], () =>
        {
            const expectCommonShape = <TCtor extends TTypedArrayCtor>
            (
                resizableArray: ISharedArray<TCtor>,
                ctor: TCtor
            ) =>
            {
                const actualArray = resizableArray.getArray();
                expect(actualArray.length).toBe(8);
                expect(resizableArray.getArray()).toBeInstanceOf(ctor);
                const numberSpec = getNumberSpecialization(ctor);
                expect(testModule.wrapper.interopIds.getId(numberSpec)).toBeGreaterThanOrEqual(0);
                expect(testModule.wrapper.interopIds.hasId(resizableArray, numberSpec)).toBe(true);
                expect(testModule.wrapper.interopIds.hasId(resizableArray, resizableArraySpecialization)).toBe(true);


                for (let i = 0; i < 8; ++i)
                {
                    // this isn't going to trigger the ASAN, but it's better than nothing...
                    expect(resizableArray.getArray()[i]).toBe(0);
                }
            };

            // use one for sanity checking purposes...
            const u8Array = ResizableArray.createOne(testModule.wrapper, Uint8Array, testModule.wrapper.rootNode, 8);
            expect(testModule.wrapper.interopIds.hasId(u8Array, numberSpecializations.f64)).toBe(false);

            expectCommonShape(u8Array, Uint8Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Int8Array, testModule.wrapper.rootNode, 8), Int8Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Uint16Array, testModule.wrapper.rootNode, 8), Uint16Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Int16Array, testModule.wrapper.rootNode, 8), Int16Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Uint32Array, testModule.wrapper.rootNode, 8), Uint32Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Int32Array, testModule.wrapper.rootNode, 8), Int32Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8), Float32Array);
            expectCommonShape(ResizableArray.createOne(testModule.wrapper, Float64Array, testModule.wrapper.rootNode, 8), Float64Array);
            testModule.wrapper.rootNode.getLinked().unlinkAll();
        }));
    });

    describe("=> getArray", () =>
    {
        let resizableArray: ResizableArray<Float32ArrayConstructor>;

        beforeEach(fpRunWithin([_Debug.labelBlock("TestSetup")], () =>
        {
            resizableArray = ResizableArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8);
        }));
        afterEach(() =>
        {
            testModule.wrapper.rootNode.getLinked().unlink(resizableArray.resourceHandle);
        });

        it("| throws an exception if there isn't enough memory", fpRunWithin([_Debug.labelBlock("OOMTest"), blockScope], () =>
        {
            testModule.wrapper.rootNode.getLinked().unlink(resizableArray.resourceHandle);
            expect(
                () => ResizableArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 0xffffffff)
            ).toThrowError("Failed to allocate memory for shared array.");
        }));

        describe("=> debug mode", () =>
        {
            it("| errors when called after release", fpRunWithin([_Debug.labelBlock("ErrorAfterReleaseTest")], () =>
            {
                testModule.wrapper.rootNode.getLinked().unlink(resizableArray.resourceHandle);
                expect(() => resizableArray.getArray()).toThrow();
            }));

            it(
                "| errors when array members are accessed after release",
                fpRunWithin([_Debug.labelBlock("UseAfterFree")], () =>
                {
                    const instance = resizableArray.getArray();
                    testModule.wrapper.rootNode.getLinked().unlink(resizableArray.resourceHandle);
                    expect(() => instance.length).toThrow();
                })
            );

            it(
                "| errors when array members are accessed and memory may have resized",
                fpRunWithin([blockScope, _Debug.labelBlock("InvalidatedMemoryTest")], () =>
                {
                    const instance = resizableArray.getArray();
                    expect(instance[0]).toBe(0);
                    const sharedArray2 = ResizableArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8);

                    if (testModule.wrapper.instance._isDebugBuild())
                    {
                        expect(() => instance[0]).toThrow();
                    }
                    else
                    {
                        expect(() => instance[0]).not.toThrow();
                    }

                    testModule.wrapper.rootNode.getLinked().unlink(resizableArray.resourceHandle);
                    testModule.wrapper.rootNode.getLinked().unlink(sharedArray2.resourceHandle);
                })
            );

            it("| returns new instance on memory growth", fpRunWithin([blockScope, _Debug.labelBlock("ResizeTest")], () =>
            {
                const resizableArray = ResizableArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 8);
                const i1 = resizableArray.getArray();
                const sharedArray2 = ResizableArray.createOne(testModule.wrapper, Float32Array, testModule.wrapper.rootNode, 2097152);
                expect(i1 === resizableArray.getArray()).toBeFalse();

                testModule.wrapper.rootNode.getLinked().unlink(resizableArray.resourceHandle);
                testModule.wrapper.rootNode.getLinked().unlink(sharedArray2.resourceHandle);
            }));
        });
    });
});
