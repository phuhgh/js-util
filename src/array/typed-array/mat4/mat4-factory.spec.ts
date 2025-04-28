import { Mat4Factory } from "./mat4-factory.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { Mat4 } from "./mat4.js";
import { Test_setDefaultFlags } from "../../../test-util/test_set-default-flags.js";
import { SanitizedEmscriptenTestModule } from "../../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { IJsUtilBindings } from "../../../web-assembly/i-js-util-bindings.js";
import type { ITestOnlyBindings } from "../../../web-assembly/i-test-only-bindings.js";
import utilTestModule from "../../../external/test-module.mjs";
import { getTestModuleOptions } from "../../../test-util/test-utils.js";
import { fpRunWithin } from "../../../fp/impl/fp-run-within.js";
import { blockScope } from "../../../lifecycle/block-scoped-lifecycle.js";

describe("=> Mat4Factory", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const factory = new Mat4Factory(Mat4.f32, NormalizedDataViewProvider.getView(Float32Array));
    const a = factory.createOne(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            expect(a.length).toBe(16);
            // noinspection SuspiciousTypeOfGuard
            expect(a instanceof Float32Array).toBe(true);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
            expect(a[2]).toBe(3);
            expect(a[3]).toBe(4);
            expect(a[4]).toBe(5);
            expect(a[5]).toBe(6);
            expect(a[6]).toBe(7);
            expect(a[7]).toBe(8);
            expect(a[8]).toBe(9);
            expect(a[9]).toBe(10);
            expect(a[10]).toBe(11);
            expect(a[11]).toBe(12);
            expect(a[12]).toBe(13);
            expect(a[13]).toBe(14);
            expect(a[14]).toBe(15);
            expect(a[15]).toBe(16);
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float32Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(16);
            expect(a[0]).toBe(2);
            expect(a[15]).toBe(17);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
            factory.copyToBuffer(new DataView(memory.buffer), a, Float32Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[16]).toBe(16);
            expect(memory[17]).toBe(18);
        });
    });

    describe("=> shared vector", () =>
    {
        const testModule = new SanitizedEmscriptenTestModule<IJsUtilBindings, ITestOnlyBindings>(utilTestModule, getTestModuleOptions());

        beforeEach(async () =>
        {
            Test_setDefaultFlags();
            await testModule.initialize();
        });

        afterEach(() =>
        {
            testModule.endEmscriptenProgram();
        });

        it("| handles lifecycle and exposes expected methods", fpRunWithin([blockScope], () =>
        {
            const sharedVec = Mat4.u16.factory.createShared(testModule.wrapper, null);
            const view = sharedVec.getArray();
            view.setIdentityMatrix();
        }));
    });
});