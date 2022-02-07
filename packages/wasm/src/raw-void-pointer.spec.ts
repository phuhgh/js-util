import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "./emscripten/sanitized-emscripten-test-module";
import { RawVoidPointer } from "./raw-void-pointer";
import { resetDebugState } from "@rc-js-util/test";
import asanTestModule from "asan-test-module";
import safeHeapTestModule from "safe-heap-test-module";

describe("=> RawVoidPointer", () =>
{
    beforeEach(() => resetDebugState());

    describe("=> asan tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(asanTestModule, emscriptenAsanTestModuleOptions);

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        afterAll(() =>
        {
            testModule.endEmscriptenProgram();
        });

        test("| creates, writes, reads and destroys without triggering the asan", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            expect(rvp.getDataView().byteLength).toEqual(128);
            new Float32Array(rvp.getDataView().buffer, rvp.pointer, 4).set([1, 2, 3, 4]);

            expect(rvp.getDataView().getFloat32(0, true)).toEqual(1);
            expect(rvp.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT, true)).toEqual(2);
            expect(rvp.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, true)).toEqual(3);
            expect(rvp.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, true)).toEqual(4);

            rvp.sharedObject.release();
            expect(rvp.sharedObject.getIsDestroyed()).toBe(true);
        });
    });

    describe("=> safe stack tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(safeHeapTestModule, emscriptenSafeHeapTestModuleOptions);

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        test("| invalidates dataView on memory resize", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            const dataView = rvp.getDataView();
            const rvp2 = RawVoidPointer.createOne(testModule.wrapper, 8388608);
            expect(() => dataView.getFloat32(0)).toThrow();

            rvp.sharedObject.release();
            rvp2.sharedObject.release();
        });

        test("| invalidates dataView on memory release", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            rvp.sharedObject.release();
            expect(() => rvp.getDataView().getFloat32(0)).toThrow();
        });

        test("| updates the dataView on resize", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            const rvp2 = RawVoidPointer.createOne(testModule.wrapper, 8388608);
            rvp.getDataView().getFloat32(0);

            rvp.sharedObject.release();
            rvp2.sharedObject.release();
        });
    });
});