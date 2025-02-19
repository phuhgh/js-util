import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { SharedMemoryBlock } from "./shared-memory-block.js";
import utilTestModule from "../../external/test-module.mjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { getTestModuleOptions, TestGarbageCollector } from "../../test-util/test-utils.js";
import { fpRunWithin } from "../../fp/impl/fp-run-within.js";
import { blockScope } from "../../lifecycle/block-scoped-lifecycle.js";
import { _Debug } from "../../debug/_debug.js";

describe("=> SharedMemoryBlock", () =>
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

    it("| creates, writes, reads and destroys without triggering the asan", fpRunWithin([blockScope], () =>
    {
        const smb = SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 128);
        expect(smb.getDataView().byteLength).toEqual(128);
        new Float32Array(smb.getDataView().buffer, smb.pointer, 4).set([1, 2, 3, 4]);

        expect(smb.getDataView().getFloat32(0, true)).toEqual(1);
        expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT, true)).toEqual(2);
        expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, true)).toEqual(3);
        expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, true)).toEqual(4);
        testModule.wrapper.rootNode.getLinked().unlinkAll();
        expect(smb.resourceHandle.getIsDestroyed()).toBeTrue();
    }));

    it("| invalidates dataView on memory resize", fpRunWithin([blockScope], () =>
    {
        const smb = SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 128);
        const dataView = smb.getDataView();
        const smb2 = SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 16777216);
        expect(() => dataView.getFloat32(0)).toThrow();

        testModule.wrapper.rootNode.getLinked().unlink(smb.resourceHandle);
        testModule.wrapper.rootNode.getLinked().unlink(smb2.resourceHandle);
    }));

    it("| invalidates dataView on memory release", fpRunWithin([blockScope], () =>
    {
        const smb = SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 128);
        testModule.wrapper.rootNode.getLinked().unlink(smb.resourceHandle);
        expect(() => smb.getDataView().getFloat32(0)).toThrow();
    }));

    it("| updates the dataView on resize", fpRunWithin([blockScope], () =>
    {
        const smb = SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 128);
        const smb2 = SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 8388608);
        smb.getDataView().getFloat32(0);
        testModule.wrapper.rootNode.getLinked().unlink(smb.resourceHandle);
        testModule.wrapper.rootNode.getLinked().unlink(smb2.resourceHandle);
    }));


    it("| errors when not released", async () =>
    {
        if (!_BUILD.DEBUG || !TestGarbageCollector.isAvailable)
        {
            return pending("Test not available in this environment");
        }

        const spy = spyOn(_Debug, "error");

        // "forget" to use the return
        SharedMemoryBlock.createOne(testModule.wrapper, testModule.wrapper.rootNode, 128);

        expect(await TestGarbageCollector.testFriendlyGc()).toBeGreaterThan(0);
        expect(spy).toHaveBeenCalledWith(jasmine.stringMatching("A shared object was leaked"));
        testModule.wrapper.rootNode.getLinked().unlinkAll();
    });
});
