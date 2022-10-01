import { ReferenceCountedOwner } from "./reference-counted-owner.js";
import { blockScopedLifecycle } from "./block-scoped-lifecycle.js";
import { setDefaultUnitTestFlags } from "../test-util/set-default-unit-test-flags.js";
import { resetLifeCycle } from "../test-util/reset-life-cycle.js";

describe("=> ReferenceCountedOwner", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
        resetLifeCycle();
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

    describe("=> createOneBound", () => {
        it("binds to the ref and releases with blockScoped blockScoped false", () => {
            const owner = new ReferenceCountedOwner(false);
            const ref = ReferenceCountedOwner.createOneBound(owner.getLinkedReferences(), false);
            expect(ref.getIsDestroyed()).toBe(false);
            owner.release();
            expect(ref.getIsDestroyed()).toBe(true);
        });

        it("binds to the ref and does not release with blockScoped true", () => {
            blockScopedLifecycle(() =>
            {
                const owner = new ReferenceCountedOwner();
                const ref = ReferenceCountedOwner.createOneBound(owner.getLinkedReferences(), true);
                ref.release();
                expect(ref.getIsDestroyed()).toBe(false);
                owner.release();
                expect(ref.getIsDestroyed()).toBe(true);
            });
        });
    });
});
