import { SanitizedEmscriptenTestModule } from "../emscripten/sanitized-emscripten-test-module.js";
import utilTestModule from "../../external/util-test-module.cjs";
import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { ReferenceCountedPtr } from "./reference-counted-ptr.js";
import { nullPointer } from "../emscripten/null-pointer.js";
import { blockScopedLifecycle } from "../../lifecycle/block-scoped-lifecycle.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";
import { getTestModuleOptions } from "../../test-util/test-utils.js";

describe("=> ReferenceCountedPtr", () =>
{
    const testModule = new SanitizedEmscriptenTestModule<object, object>(utilTestModule, getTestModuleOptions());

    beforeAll(async () =>
    {
        Test_setDefaultFlags();
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