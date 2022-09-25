import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import { SharedTypedArrayTuple } from "./shared-typed-array-tuple.js";
import { Range2d } from "./2d/range2d/range2d.js";
import { isLittleEndian } from "../../web-assembly/util/is-little-endian.js";
import { blockScopedLifecycle } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";
import { resetLifeCycle } from "../../test-util/reset-life-cycle.js";

describe("=> SharedTypedArrayTuple", () =>
{
    let testOwner: ReferenceCountedOwner;

    beforeEach(() =>
    {
        testOwner = new ReferenceCountedOwner(false);
        resetLifeCycle();
    });

    afterEach(() => testOwner.release());
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

    describe("=> Range2d.f32", () =>
    {
        it("| creates, writes, reads and destroys without triggering the asan", () =>
        {
            blockScopedLifecycle(() =>
            {
                const testRange = Range2d.f32.factory.createOne(1, 2, 3, 4);
                const sharedTuple = SharedTypedArrayTuple.createOne(Range2d.f32, testOwner.getLinkedReferences(), testModule.wrapper);
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

                sharedTuple.sharedObject.release();
                testOwner.release();
                expect(sharedTuple.sharedObject.getIsDestroyed()).toBeTrue();
            });
        });
    });

    describe("=> Range2d.f32", () =>
    {
        it("| creates, writes, reads and destroys without triggering the asan", () =>
        {
            blockScopedLifecycle(() =>
            {
                const testRange = Range2d.u8.factory.createOne(1, 2, 3, 4);
                const sharedTuple = SharedTypedArrayTuple.createOne(Range2d.u8, testOwner.getLinkedReferences(), testModule.wrapper);
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

                sharedTuple.sharedObject.release();
                sharedTuple.sharedObject.release();
                expect(sharedTuple.sharedObject.getIsDestroyed()).toBeTrue();
            });
        });
    });
});