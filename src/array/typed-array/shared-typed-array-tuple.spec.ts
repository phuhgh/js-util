import { SanitizedEmscriptenTestModule } from "../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import utilTestModule from "../../external/test-module.mjs";
import { SharedTypedArrayTuple } from "./shared-typed-array-tuple.js";
import { Range2d } from "./2d/range2d/range2d.js";
import { isLittleEndian } from "../../web-assembly/util/is-little-endian.js";
import { getTestModuleOptions, TestGarbageCollector } from "../../test-util/test-utils.js";
import { fpRunWithin } from "../../fp/impl/fp-run-within.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";
import { _Debug } from "../../debug/_debug.js";

describe("=> SharedTypedArrayTuple", () =>
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

    describe("=> Range2d.f32", () =>
    {
        it("| creates, writes, reads and destroys without triggering the asan", fpRunWithin([blockScope], () =>
        {
            const testRange = Range2d.f32.factory.createOne(1, 2, 3, 4);
            const sharedTuple = SharedTypedArrayTuple.createOne(Range2d.f32, testModule.wrapper.rootNode, testModule.wrapper);
            sharedTuple.copyToBuffer(testRange);

            expect(sharedTuple.memory.getDataView().byteLength).toEqual(16);

            expect(sharedTuple.memory.getDataView().getFloat32(0, isLittleEndian)).toEqual(1);
            expect(sharedTuple.memory.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT, isLittleEndian)).toEqual(2);
            expect(sharedTuple.memory.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, isLittleEndian)).toEqual(3);
            expect(sharedTuple.memory.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, isLittleEndian)).toEqual(4);

            const emptyRange = new Range2d.f32();
            sharedTuple.copyFromBuffer(emptyRange);
            expect(emptyRange[0]).toEqual(1);
            expect(emptyRange[1]).toEqual(2);
            expect(emptyRange[2]).toEqual(3);
            expect(emptyRange[3]).toEqual(4);

            testModule.wrapper.rootNode.getLinked().unlink(sharedTuple.resourceHandle);
            expect(sharedTuple.resourceHandle.getIsDestroyed()).toBeTrue();
        }));
    });

    describe("=> Range2d.f32", () =>
    {
        it("| creates, writes, reads and destroys without triggering the asan", fpRunWithin([blockScope], (() =>
        {
            const testRange = Range2d.u8.factory.createOne(1, 2, 3, 4);
            const sharedTuple = SharedTypedArrayTuple.createOne(Range2d.u8, testModule.wrapper.rootNode, testModule.wrapper);
            sharedTuple.copyToBuffer(testRange);

            expect(sharedTuple.memory.getDataView().byteLength).toEqual(4);

            expect(sharedTuple.memory.getDataView().getUint8(0)).toEqual(1);
            expect(sharedTuple.memory.getDataView().getUint8(Uint8Array.BYTES_PER_ELEMENT)).toEqual(2);
            expect(sharedTuple.memory.getDataView().getUint8(Uint8Array.BYTES_PER_ELEMENT * 2)).toEqual(3);
            expect(sharedTuple.memory.getDataView().getUint8(Uint8Array.BYTES_PER_ELEMENT * 3)).toEqual(4);

            const emptyRange = new Range2d.u8();
            sharedTuple.copyFromBuffer(emptyRange);
            expect(emptyRange[0]).toEqual(1);
            expect(emptyRange[1]).toEqual(2);
            expect(emptyRange[2]).toEqual(3);
            expect(emptyRange[3]).toEqual(4);

            testModule.wrapper.rootNode.getLinked().unlink(sharedTuple.resourceHandle);
            expect(sharedTuple.resourceHandle.getIsDestroyed()).toBeTrue();
        })));
    });

    it("| errors when not released", async () =>
    {
        if (!_BUILD.DEBUG || !TestGarbageCollector.isAvailable)
        {
            return pending("Test not available in this environment");
        }

        const spy = spyOn(_Debug, "error");

        // "forget" to use the return
        SharedTypedArrayTuple.createOne(Range2d.u8, testModule.wrapper.rootNode, testModule.wrapper);

        expect(await TestGarbageCollector.testFriendlyGc()).toBeGreaterThan(0);
        expect(spy).toHaveBeenCalledWith(jasmine.stringMatching("A shared object was leaked"));
        testModule.wrapper.rootNode.getLinked().unlinkAll();
    });
});