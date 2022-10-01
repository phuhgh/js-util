import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { SharedMemoryBlock } from "./shared-memory-block.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import safeHeapTestModule from "../../external/safe-heap-test-module.cjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { blockScopedLifecycle } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";

// typically not good usage to directly release, but it shouldn't error to release twice
describe("=> SharedMemoryBlock", () =>
{
    let testOwner: ReferenceCountedOwner;

    beforeEach(() =>
    {
        testOwner = new ReferenceCountedOwner(false);
    });
    afterEach(() => testOwner.release());

    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

        beforeAll(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        afterAll(() =>
        {
            testModule.endEmscriptenProgram();
        });

        beforeEach(() => testModule.reset());

        it("| creates, writes, reads and destroys without triggering the asan", () =>
        {
            blockScopedLifecycle(() =>
            {
                const smb = SharedMemoryBlock.createOne(testModule.wrapper, testOwner.getLinkedReferences(), 128);
                expect(smb.getDataView().byteLength).toEqual(128);
                new Float32Array(smb.getDataView().buffer, smb.pointer, 4).set([1, 2, 3, 4]);

                expect(smb.getDataView().getFloat32(0, true)).toEqual(1);
                expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT, true)).toEqual(2);
                expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, true)).toEqual(3);
                expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, true)).toEqual(4);

                testOwner.release();
                smb.sharedObject.release();
                expect(smb.sharedObject.getIsDestroyed()).toBeTrue();
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

        beforeEach(() => testModule.reset());

        it("| invalidates dataView on memory resize", () =>
        {
            blockScopedLifecycle(() =>
            {
                const smb = SharedMemoryBlock.createOne(testModule.wrapper, testOwner.getLinkedReferences(), 128);
                const dataView = smb.getDataView();
                const smb2 = SharedMemoryBlock.createOne(testModule.wrapper, testOwner.getLinkedReferences(), 8388608);
                expect(() => dataView.getFloat32(0)).toThrow();

                smb.sharedObject.release();
                smb2.sharedObject.release();
            });
        });

        it("| invalidates dataView on memory release", () =>
        {
            blockScopedLifecycle(() =>
            {
                const smb = SharedMemoryBlock.createOne(testModule.wrapper, testOwner.getLinkedReferences(), 128);
                smb.sharedObject.release();
                testOwner.release();
                expect(() => smb.getDataView().getFloat32(0)).toThrow();
            });
        });

        it("| updates the dataView on resize", () =>
        {
            blockScopedLifecycle(() =>
            {
                const smb = SharedMemoryBlock.createOne(testModule.wrapper, testOwner.getLinkedReferences(), 128);
                const smb2 = SharedMemoryBlock.createOne(testModule.wrapper, testOwner.getLinkedReferences(), 8388608);
                smb.getDataView().getFloat32(0);

                smb.sharedObject.release();
                smb2.sharedObject.release();
            });
        });
    });
});