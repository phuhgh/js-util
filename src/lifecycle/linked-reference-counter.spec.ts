import { ILinkedReferenceCounter, LinkedReferenceCounter } from "./linked-reference-counter.js";

describe("=> LinkedReferenceCounter", () =>
{
    describe("=> bindBlockScope", () =>
    {
        it("| binds objects created in scope", () =>
        {
            const owner = new LinkedReferenceCounter();
            let ptr!: ILinkedReferenceCounter;

            owner.bindBlockScope(() =>
            {
                ptr = new LinkedReferenceCounter();
                expect(ptr.getIsDestroyed()).toBe(false);
            });

            expect(ptr.getIsDestroyed()).toBe(false);
            owner.release();
            expect(ptr.getIsDestroyed()).toBe(true);
        });

        it("| binds to the top of the stack where nested", () =>
        {
            const owner = new LinkedReferenceCounter();
            let c1!: ILinkedReferenceCounter;
            let c2!: ILinkedReferenceCounter;

            owner.bindBlockScope(() =>
            {
                c1 = new LinkedReferenceCounter();
                c1.bindBlockScope(() =>
                {
                    c2 = new LinkedReferenceCounter();
                });
            });

            expect(owner.getIsDestroyed()).toBe(false);
            expect(c1.getIsDestroyed()).toBe(false);
            expect(c2.getIsDestroyed()).toBe(false);

            c1.unlinkRef(c2);

            expect(owner.getIsDestroyed()).toBe(false);
            expect(c1.getIsDestroyed()).toBe(false);
            expect(c2.getIsDestroyed()).toBe(true);

            owner.release();
            expect(owner.getIsDestroyed()).toBe(true);
            expect(c1.getIsDestroyed()).toBe(true);
            expect(c2.getIsDestroyed()).toBe(true);
        });
    });

    describe("=> unlinkAllRefs", () =>
    {
        it("| drops all ref claims, but leaves the object alive", () =>
        {
            const owner = new LinkedReferenceCounter();
            let ptr!: ILinkedReferenceCounter;

            owner.bindBlockScope(() =>
            {
                ptr = new LinkedReferenceCounter();
            });
            expect(ptr.getIsDestroyed()).toBe(false);
            expect(owner.getIsDestroyed()).toBe(false);

            owner.unlinkAllRefs();
            expect(ptr.getIsDestroyed()).toBe(true);
            expect(owner.getIsDestroyed()).toBe(false);
        });
    });

    describe("=> on free listener", () =>
    {
        it("| is called on free", () =>
        {
            const owner = new LinkedReferenceCounter();
            const spy = jasmine.createSpy();
            owner.registerOnFreeListener(spy);

            owner.unlinkAllRefs();
            expect(spy).not.toHaveBeenCalled();

            owner.release();
            expect(spy).toHaveBeenCalled();
        });
    });
});
