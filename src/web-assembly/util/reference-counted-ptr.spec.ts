import { ReferenceCountedPtr } from "./reference-counted-ptr.js";
import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";

describe("=> ReferenceCountedPtr", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<object, object>(asanTestModule, emscriptenAsanTestModuleOptions);

    beforeAll(async () =>
    {
        setDefaultUnitTestFlags();
        await testModule.initialize();
    });

    beforeEach(() =>
    {
        testModule.reset();
    });

    describe("=> bindLifecycle", () =>
    {
        it("| ties the lifecycle", () =>
        {
            const owner = new ReferenceCountedPtr(false, 1, testModule.wrapper, { onFree: () => undefined });
            const child = new ReferenceCountedPtr(false, 2, testModule.wrapper, { onFree: () => undefined });
            owner.bindLifecycle(child);
            child.release();
            expect(child.getIsDestroyed()).toBeFalse();
            owner.release();
            expect(child.getIsDestroyed()).toBeTrue();
            expect(owner.getIsDestroyed()).toBeTrue();
        });

        it("| errors if a cycle is detected", () =>
        {
            const a = new ReferenceCountedPtr(false, 1, testModule.wrapper, { onFree: () => undefined });
            const b = new ReferenceCountedPtr(false, 2, testModule.wrapper, { onFree: () => undefined });
            a.bindLifecycle(b);
            expect(() => b.bindLifecycle(a)).toThrow();
        });
    });

    describe("=> takeOwnership", () =>
    {
        it("| ties the lifecycle", () =>
        {
            const owner = new ReferenceCountedPtr(false, 1, testModule.wrapper, { onFree: () => undefined });
            const child = new ReferenceCountedPtr(false, 2, testModule.wrapper, { onFree: () => undefined });
            owner.takeOwnership(child);
            expect(child.getIsDestroyed()).toBeFalse();
            owner.release();
            expect(child.getIsDestroyed()).toBeTrue();
            expect(owner.getIsDestroyed()).toBeTrue();
        });
    });

    describe("=> unbindLifecycles", () =>
    {
        it("| unbinds each shared ptr", () =>
        {
            const a = new ReferenceCountedPtr(false, 1, testModule.wrapper, { onFree: () => undefined });
            const b = new ReferenceCountedPtr(false, 2, testModule.wrapper, { onFree: () => undefined });
            const c = new ReferenceCountedPtr(false, 3, testModule.wrapper, { onFree: () => undefined });
            a.takeOwnership(b);
            a.takeOwnership(c);
            a.release();

            expect(a.getIsDestroyed()).toBeTrue();
            expect(b.getIsDestroyed()).toBeTrue();
            expect(c.getIsDestroyed()).toBeTrue();
        });
    });
});