import { ReferenceCountedOwner } from "./reference-counted-owner.js";

describe("=> LinkedReferenceCounter", () =>
{
    describe("linkRef", () =>
    {
        it("| errors if a cycle is detected", () =>
        {
            const a = new ReferenceCountedOwner(false);
            const b = new ReferenceCountedOwner(false);
            a.getLinkedReferences().linkRef(b);
            expect(() => b.getLinkedReferences().linkRef(a)).toThrow();
        });
    });

    describe("=> unlinkAllRefs", () =>
    {
        it("| drops all ref claims, but leaves the object alive", () =>
        {
            const owner = new ReferenceCountedOwner(false);
            const ptr = new ReferenceCountedOwner(false);

            owner.getLinkedReferences().linkRef(ptr);
            ptr.release();
            expect(ptr.getIsDestroyed()).toBe(false);
            expect(owner.getIsDestroyed()).toBe(false);

            owner.getLinkedReferences().unlinkAllRefs();
            expect(ptr.getIsDestroyed()).toBe(true);
            expect(owner.getIsDestroyed()).toBe(false);
        });
    });

    describe("=> on free listener", () =>
    {
        it("| is called on free", () =>
        {
            const owner = new ReferenceCountedOwner(false);
            const spy = jasmine.createSpy();
            owner.registerOnFreeListener(spy);

            owner.getLinkedReferences().unlinkAllRefs();
            expect(spy).not.toHaveBeenCalled();

            owner.release();
            expect(spy).toHaveBeenCalled();
        });
    });
});