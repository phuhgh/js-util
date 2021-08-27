import { emscriptenAsanTestModuleOptions, emscriptenSafeHeapTestModuleOptions, SanitizedEmscriptenTestModule } from "./emscripten/sanitized-emscripten-test-module";
import { debugDescribe } from "../test-utils";
import { Emscripten } from "../../external/emscripten";
import { RawVoidPointer } from "./raw-void-pointer";

declare const require: (path: string) => Emscripten.EmscriptenModuleFactory;
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

        it("| creates and destroys as expected", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            expect(rvp.dataView.byteLength).toEqual(128);
            new Float32Array(rvp.dataView.buffer, rvp.pointer, 4).set([1, 2, 3, 4]);

            expect(rvp.dataView.getFloat32(0, true)).toEqual(1);
            expect(rvp.dataView.getFloat32(Float32Array.BYTES_PER_ELEMENT, true)).toEqual(2);
            expect(rvp.dataView.getFloat32(Float32Array.BYTES_PER_ELEMENT * 2, true)).toEqual(3);
            expect(rvp.dataView.getFloat32(Float32Array.BYTES_PER_ELEMENT * 3, true)).toEqual(4);

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

        it("| provides a view into the memory, regardless of page resizes", () =>
        {
            const rvp = RawVoidPointer.createOne(testModule.wrapper, 128);
            const rvp2 = RawVoidPointer.createOne(testModule.wrapper, 8388608);
            rvp.sharedObject.release();
            rvp2.sharedObject.release();
        });
    });
});