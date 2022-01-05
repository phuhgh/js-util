import { ReferenceCountedPtr } from "./reference-counted-ptr";
import { resetDebugState } from "@rc-js-util/test";

describe("=> ReferenceCountedPtr", () =>
{
    beforeEach(() => resetDebugState());

    describe("=> bindLifecycle", () =>
    {
        test("| ties the lifecycle", () =>
        {
            const owner = new ReferenceCountedPtr(false, 1, { onFree: () => undefined });
            const child = new ReferenceCountedPtr(false, 2, { onFree: () => undefined });
            owner.bindLifecycle(child);
            child.release();
            expect(child.getIsDestroyed()).toBe(false);
            owner.release();
            expect(child.getIsDestroyed()).toBe(true);
            expect(owner.getIsDestroyed()).toBe(true);
        });

        test("| errors if a cycle is detected", () =>
        {
            const a = new ReferenceCountedPtr(false, 1, { onFree: () => undefined });
            const b = new ReferenceCountedPtr(false, 2, { onFree: () => undefined });
            a.bindLifecycle(b);
            expect(() => b.bindLifecycle(a)).toThrow();
        });
    });

    describe("=> takeOwnership", () =>
    {
        test("| ties the lifecycle", () =>
        {
            const owner = new ReferenceCountedPtr(false, 1, { onFree: () => undefined });
            const child = new ReferenceCountedPtr(false, 2, { onFree: () => undefined });
            owner.takeOwnership(child);
            expect(child.getIsDestroyed()).toBe(false);
            owner.release();
            expect(child.getIsDestroyed()).toBe(true);
            expect(owner.getIsDestroyed()).toBe(true);
        });
    });

    describe("=> unbindLifecycles", () =>
    {
        test("| unbinds each shared ptr", () =>
        {
            const a = new ReferenceCountedPtr(false, 1, { onFree: () => undefined });
            const b = new ReferenceCountedPtr(false, 2, { onFree: () => undefined });
            const c = new ReferenceCountedPtr(false, 3, { onFree: () => undefined });
            a.takeOwnership(b);
            a.takeOwnership(c);
            a.release();

            expect(a.getIsDestroyed()).toBe(true);
            expect(b.getIsDestroyed()).toBe(true);
            expect(c.getIsDestroyed()).toBe(true);
        });
    });
});
