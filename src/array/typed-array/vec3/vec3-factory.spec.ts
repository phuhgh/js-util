import { Vec3Factory } from "./vec3-factory.js";
import { NormalizedDataViewProvider } from "../normalized-data-view/normalized-data-view-provider.js";
import { Vec3 } from "./vec3.js";
import { Test_setDefaultFlags } from "../../../test-util/test_set-default-flags.js";
import { SanitizedEmscriptenTestModule } from "../../../web-assembly/emscripten/sanitized-emscripten-test-module.js";
import { IJsUtilBindings } from "../../../web-assembly/i-js-util-bindings.js";
import type { ITestOnlyBindings } from "../../../web-assembly/i-test-only-bindings.js";
import utilTestModule from "../../../external/test-module.mjs";
import { getTestModuleOptions } from "../../../test-util/test-utils.js";
import { fpRunWithin } from "../../../fp/impl/fp-run-within.js";
import { blockScope } from "../../../lifecycle/block-scoped-lifecycle.js";

describe("=> Vec3Factory", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
    });

    const factory = new Vec3Factory(Vec3.f32, NormalizedDataViewProvider.getView(Float32Array));

    describe("=> create one", () =>
    {
        it("| produces the expected array", () =>
        {
            const a = factory.createOne(1, 2, 3);
            expect(a.length).toBe(3);
            // noinspection SuspiciousTypeOfGuard
            expect(a instanceof Float32Array).toBe(true);
            expect(a[0]).toBe(1);
            expect(a[1]).toBe(2);
            expect(a[2]).toBe(3);
        });
    });

    describe("=> copyFromBuffer", () =>
    {
        it("| produces the expected array", () =>
        {
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
            const a = factory.copyFromBuffer(new DataView(memory.buffer), Float32Array.BYTES_PER_ELEMENT);
            expect(a.length).toBe(3);
            expect(a[0]).toBe(2);
            expect(a[1]).toBe(3);
            expect(a[2]).toBe(4);
        });
    });

    describe("=> copyToBuffer", () =>
    {
        it("| updates the buffer at the specified location", () =>
        {
            const a = factory.createOne(1, 2, 3);
            const memory = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);

            factory.copyToBuffer(new DataView(memory.buffer), a, Float32Array.BYTES_PER_ELEMENT);
            expect(memory[0]).toBe(1);
            expect(memory[1]).toBe(1);
            expect(memory[2]).toBe(2);
            expect(memory[3]).toBe(3);
            expect(memory[4]).toBe(5);
            expect(memory[5]).toBe(6);
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
            const sharedVec = Vec3.u16.factory.createShared(testModule.wrapper, null);
            const view = sharedVec.getArray();
            view.setX(1);
            view.setY(2);
            view.setZ(3);
            expect(view.getMagnitude()).toBe(Math.sqrt(14));
        }));
    });
});