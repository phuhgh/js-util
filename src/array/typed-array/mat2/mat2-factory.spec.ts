import { Mat2Factory } from "./mat2-factory.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { Mat2 } from "./mat2.js";
import { Vec2 } from "../vec2/vec2.js";
import { Test_setDefaultFlags } from "../../../test-util/test_set-default-flags.js";
import { SanitizedEmscriptenTestModule } from "../../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { IJsUtilBindings } from "../../../web-assembly/i-js-util-bindings.js";
import type { ITestOnlyBindings } from "../../../web-assembly/i-test-only-bindings.js";
import utilTestModule from "../../../external/test-module.mjs";
import { getTestModuleOptions } from "../../../test-util/test-utils.js";
import { fpRunWithin } from "../../../fp/impl/fp-run-within.js";
import { blockScope } from "../../../lifecycle/block-scoped-lifecycle.js";

describe("=> Mat2Factory", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const factory = new Mat2Factory(Mat2.f64, NormalizedDataViewProvider.getView(Float64Array));

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            const a = factory.createOne(1, 2, 3, 4);
            expect(a.length).toBe(4);
            // noinspection SuspiciousTypeOfGuard
            expect(a instanceof Float64Array).toBe(true);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
            expect(a[2]).toBe(3);
            expect(a[3]).toBe(4);
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float64Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(4);
            expect(a[0]).toBe(2);
            expect(a[1]).toBe(3);
            expect(a[2]).toBe(4);
            expect(a[3]).toBe(5);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const a = factory.createOne(1, 2, 3, 4);
            const memory = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8]);

            factory.copyToBuffer(new DataView(memory.buffer), a, Float64Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[2]).toBe(2);
            expect(memory[3]).toBe(3);
            expect(memory[4]).toBe(4);
            expect(memory[5]).toBe(6);
        });
    });

    describe("=> setValueAt", () =>
    {
        it("| sets the expected element", () =>
        {
            const m4 = Mat2.f32.factory.createOne(1, 2, 3, 4);
            m4.setValueAt(0, 1, 99);
            expect(m4[2]).toBe(99);
        });
    });

    describe("=> getRow", () =>
    {
        it("| returns rows as vec2", () =>
        {
            const a = Mat2.f32.factory.createOne(1, 2, 3, 4);
            expect(a.getRow(1)).toEqual(Vec2.f32.factory.createOne(3, 4));
        });
    });

    describe("=> setRow", () =>
    {
        it("| modifies the array as expected", () =>
        {
            const a = Mat2.f32.factory.createOne(1, 2, 3, 4);
            a.setRow(1, Vec2.f32.factory.createOne(1, 2,));
            expect(a).toEqual(Mat2.f32.factory.createOne(1, 2, 1, 2));
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
            const sharedVec = Mat2.u16.factory.createShared(testModule.wrapper, null);
            const view = sharedVec.getArray();
            view.setIdentityMatrix();
        }));
    });
});