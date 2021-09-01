import { ReferenceCountedPtr } from "./reference-counted-ptr";

describe("=> ReferenceCountedPtr", () =>
{
    describe("=> bindLifecycle", () =>
    {
        it("| ties the lifecycle", () =>
        {
            const owner = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            const child = new ReferenceCountedPtr(false, 2, { onRelease: () => undefined });
            owner.bindLifecycle(child);
            child.release();
            expect(child.getIsDestroyed()).toBeFalse();
            owner.release();
            expect(child.getIsDestroyed()).toBeTrue();
            expect(owner.getIsDestroyed()).toBeTrue();
        });

        it("| errors if a cycle is detected", () =>
        {
            const a = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            const b = new ReferenceCountedPtr(false, 2, { onRelease: () => undefined });
            const c = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            a.bindLifecycle(b);
            b.bindLifecycle(c);
            expect(() => c.bindLifecycle(a)).toThrow();
        });

        it("| errors if the same address is linked", () =>
        {
            const a = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            const b = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            expect(() => a.bindLifecycle(b)).toThrow();
        });
    });

    describe("=> takeOwnership", () =>
    {
        it("| ties the lifecycle", () =>
        {
            const owner = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            const child = new ReferenceCountedPtr(false, 2, { onRelease: () => undefined });
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
            const a = new ReferenceCountedPtr(false, 1, { onRelease: () => undefined });
            const b = new ReferenceCountedPtr(false, 2, { onRelease: () => undefined });
            const c = new ReferenceCountedPtr(false, 3, { onRelease: () => undefined });
            a.takeOwnership(b);
            a.takeOwnership(c);
            a.release();

            expect(a.getIsDestroyed()).toBeTrue();
            expect(b.getIsDestroyed()).toBeTrue();
            expect(c.getIsDestroyed()).toBeTrue();
        });
    });
});