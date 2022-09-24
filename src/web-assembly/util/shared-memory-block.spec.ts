import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import { SharedMemoryBlock } from "./shared-memory-block.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import safeHeapTestModule from "../../external/safe-heap-test-module.cjs";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> SharedMemoryBlock", () =>
{
    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

        beforeAll(async () =>
        {
            setDefaultUnitTestFlags();
            await testModule.initialize();
        });

        afterAll(() =>
        {
            testModule.endEmscriptenProgram();
        });

        it("| creates, writes, reads and destroys without triggering the asan", () =>
        {
            const smb = SharedMemoryBlock.createOne(testModule.wrapper, 128);
            expect(smb.getDataView().byteLength).toEqual(128);
            new Float32Array(smb.getDataView().buffer, smb.pointer, 4).set([1, 2, 3, 4]);

            expect(smb.getDataView().getFloat32(0, true)).toEqual(1);
            expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT, true)).toEqual(2);
            expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, true)).toEqual(3);
            expect(smb.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, true)).toEqual(4);

            smb.sharedObject.release();
            expect(smb.sharedObject.getIsDestroyed()).toBeTrue();
        });
    });

    describe("=> safe stack tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(safeHeapTestModule, emscriptenSafeHeapTestModuleOptions);

        beforeAll(async () =>
        {
            setDefaultUnitTestFlags();
            await testModule.initialize();
        });

        it("| invalidates dataView on memory resize", () =>
        {
            const smb = SharedMemoryBlock.createOne(testModule.wrapper, 128);
            const dataView = smb.getDataView();
            const smb2 = SharedMemoryBlock.createOne(testModule.wrapper, 8388608);
            expect(() => dataView.getFloat32(0)).toThrow();

            smb.sharedObject.release();
            smb2.sharedObject.release();
        });

        it("| invalidates dataView on memory release", () =>
        {
            const smb = SharedMemoryBlock.createOne(testModule.wrapper, 128);
            smb.sharedObject.release();
            expect(() => smb.getDataView().getFloat32(0)).toThrow();
        });

        it("| updates the dataView on resize", () =>
        {
            const smb = SharedMemoryBlock.createOne(testModule.wrapper, 128);
            const smb2 = SharedMemoryBlock.createOne(testModule.wrapper, 8388608);
            smb.getDataView().getFloat32(0);

            smb.sharedObject.release();
            smb2.sharedObject.release();
        });
    });
});