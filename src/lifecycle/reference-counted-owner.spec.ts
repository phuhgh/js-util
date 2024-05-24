import { ReferenceCountedOwner } from "./reference-counted-owner.js";
import { blockScopedCallback, blockScopedLifecycle } from "./block-scoped-lifecycle.js";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { Test_resetLifeCycle } from "../test-util/test_reset-life-cycle.js";

describe("=> ReferenceCountedOwner", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
        Test_resetLifeCycle();
    });

    it("| calls onFree callbacks on free", () =>
    {
        const ref = new ReferenceCountedOwner(false);
        const spy = jasmine.createSpy();
        ref.registerOnFreeListener(spy);
        ref.release();
        expect(spy).toHaveBeenCalledOnceWith();
    });

    it("| clears all linked refs on free", () =>
    {
        const ref = new ReferenceCountedOwner(false);
        let linkedRef!: ReferenceCountedOwner;

        blockScopedLifecycle(() =>
        {
            linkedRef = new ReferenceCountedOwner();
            ref.getLinkedReferences().linkRef(linkedRef);
            expect(linkedRef.getIsDestroyed()).toBe(false);
        });

        ref.release();
        expect(linkedRef.getIsDestroyed()).toBe(true);
    });

    describe("=> createOneBound", () =>
    {
        it("binds to the ref and releases with blockScoped blockScoped false", () =>
        {
            const owner = new ReferenceCountedOwner(false);
            const ref = ReferenceCountedOwner.createOneBound(owner.getLinkedReferences(), false);
            expect(ref.getIsDestroyed()).toBe(false);
            owner.release();
            expect(ref.getIsDestroyed()).toBe(true);
        });

        it("binds to the ref and does not release with blockScoped true", blockScopedCallback(() =>
        {
            const owner = new ReferenceCountedOwner();
            const ref = ReferenceCountedOwner.createOneBound(owner.getLinkedReferences(), true);
            ref.release();
            expect(ref.getIsDestroyed()).toBe(false);
            owner.release();
            expect(ref.getIsDestroyed()).toBe(true);

        }));
    });
});
