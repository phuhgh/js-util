import { SanitizedEmscriptenTestModule } from "../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import utilTestModule from "../../external/util-test-module.mjs";
import { SharedTypedArrayTuple } from "./shared-typed-array-tuple.js";
import { Range2d } from "./2d/range2d/range2d.js";
import { isLittleEndian } from "../../web-assembly/util/is-little-endian.js";
import { blockScopedCallback } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";
import { Test_resetLifeCycle } from "../../test-util/test_reset-life-cycle.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";

describe("=> SharedTypedArrayTuple", () =>
{
    let testOwner: ReferenceCountedOwner;

    beforeEach(() =>
    {
        testOwner = new ReferenceCountedOwner(false);
        Test_resetLifeCycle();
    });

    afterEach(() => testOwner.release());
    const testModule = new SanitizedEmscriptenTestModule(utilTestModule, getTestModuleOptions());

    beforeAll(async () =>
    {
        Test_setDefaultFlags();
        await testModule.initialize();
    });

    afterAll(() =>
    {
        testModule.endEmscriptenProgram();
    });

    describe("=> Range2d.f32", () =>
    {
        it("| creates, writes, reads and destroys without triggering the asan", blockScopedCallback(() =>
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
        }));
    });

    describe("=> Range2d.f32", () =>
    {
        it("| creates, writes, reads and destroys without triggering the asan", blockScopedCallback(() =>
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
        }));
    });
});