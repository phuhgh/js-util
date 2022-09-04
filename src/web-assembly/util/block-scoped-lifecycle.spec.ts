import { blockScopedLifecycle } from "./block-scoped-lifecycle.js";
import { ILinkedReferenceCounter, LinkedReferenceCounter } from "../../lifecycle/linked-reference-counter.js";

describe("=>  blockScopedLifecycle", () =>
{
    it("| releases on callback return", () =>
    {
        let ptr!: ILinkedReferenceCounter;

        blockScopedLifecycle(() =>
        {
            ptr = new LinkedReferenceCounter();
            expect(ptr.getIsDestroyed()).toBe(false);
        });

        expect(ptr.getIsDestroyed()).toBe(true);
    });
});
