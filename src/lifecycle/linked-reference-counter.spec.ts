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
    });
});
