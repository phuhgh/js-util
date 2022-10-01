import { emscriptenAsanTestModuleOptions, SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import asanTestModule from "../../external/asan-test-module.cjs";
import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";
import { ReferenceCountedPtr } from "./reference-counted-ptr.js";
import { nullPointer } from "../emscripten/null-pointer.js";
import { blockScopedLifecycle } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";

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

    it("| sets the pointer to null on free", () =>
    {
        blockScopedLifecycle(() =>
        {
            const ptr = new ReferenceCountedPtr(false, 1, testModule.wrapper);
            expect(ptr.getPtr()).toBe(1);
            ptr.release();
            expect(ptr.getPtr()).toBe(nullPointer);
        });
    });

    it("| calls onFree callbacks on free", () =>
    {
        blockScopedLifecycle(() =>
        {
            const ref = new ReferenceCountedPtr(false, 1, testModule.wrapper);
            const spy = jasmine.createSpy();
            ref.registerOnFreeListener(spy);
            ref.release();
            expect(spy).toHaveBeenCalledOnceWith();
        });
    });

    it("| clears all linked refs on free", () =>
    {
        blockScopedLifecycle(() =>
        {
            const ref = new ReferenceCountedPtr(false, 1, testModule.wrapper);
            const linkedRef = new ReferenceCountedPtr(false, 2, testModule.wrapper);
            ref.getLinkedReferences().linkRef(linkedRef);
            linkedRef.release();

            expect(linkedRef.getIsDestroyed()).toBe(false);

            ref.release();
            expect(linkedRef.getIsDestroyed()).toBe(true);
        });
    });

    describe("=> createOneBound", () =>
    {
        it("binds to the ref", () =>
        {
            blockScopedLifecycle(() =>
            {
                const owner = new ReferenceCountedOwner();
                const ptr = ReferenceCountedPtr.createOneBound(owner.getLinkedReferences(), false, 1, testModule.wrapper);
                ptr.release();
                expect(ptr.getIsDestroyed()).toBe(false);
                owner.release();
                expect(ptr.getIsDestroyed()).toBe(true);
            });
        });
    });
});