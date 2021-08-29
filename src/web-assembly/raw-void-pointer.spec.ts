import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "./emscripten/sanitized-emscripten-test-module";
import { debugDescribe } from "../test-utils";
import { Emscripten } from "../../external/emscripten";
import { RawVoidPointer } from "./raw-void-pointer";
import { JsUtilBindings } from "./js-util-bindings";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory<JsUtilBindings>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const asanTestModule = require("../../external/asan-test-module");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const safeHeapTestModule = require("../../external/safe-heap-test-module");

debugDescribe("=> RawVoidPointer", () =>
{
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

        it("| creates, writes, reads and destroys without triggering the asan", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            expect(rvp.getDataView().byteLength).toEqual(128);
            new Float32Array(rvp.getDataView().buffer, rvp.pointer, 4).set([1, 2, 3, 4]);

            expect(rvp.getDataView().getFloat32(0, true)).toEqual(1);
            expect(rvp.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT, true)).toEqual(2);
            expect(rvp.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, true)).toEqual(3);
            expect(rvp.getDataView().getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, true)).toEqual(4);

            rvp.sharedObject.release();
            expect(rvp.sharedObject.getIsDestroyed()).toBeTrue();
        });
    });

    describe("=> safe stack tests", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule(safeHeapTestModule, emscriptenSafeHeapTestModuleOptions);

        beforeAll(async () =>
        {
            await testModule.initialize();
        });

        it("| invalidates dataView on memory resize", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            const dataView = rvp.getDataView();
            const rvp2 = RawVoidPointer.createOne(testModule.wrapper, 8388608);
            expect(() => dataView.getFloat32(0)).toThrow();

            rvp.sharedObject.release();
            rvp2.sharedObject.release();
        });

        it("| invalidates dataView on memory release", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            rvp.sharedObject.release();
            expect(() => rvp.getDataView().getFloat32(0)).toThrow();
        });

        it("| updates the dataView on resize", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            const rvp2 = RawVoidPointer.createOne(testModule.wrapper, 8388608);
            rvp.getDataView().getFloat32(0);

            rvp.sharedObject.release();
            rvp2.sharedObject.release();
        });
    });
});