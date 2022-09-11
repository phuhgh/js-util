import { blockScopedLifecycle } from "./block-scoped-lifecycle.js";
import { ILinkedReferenceCounter, LinkedReferenceCounter } from "../../lifecycle/linked-reference-counter.js";
import { lifecycleStack } from "../emscripten/lifecycle-stack.js";

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

    it("| handles nested calls", () =>
    {
        let outer!: ILinkedReferenceCounter;

        blockScopedLifecycle(() =>
        {
            let inner!: ILinkedReferenceCounter;
            outer = new LinkedReferenceCounter();
            expect(outer.getIsDestroyed()).toBe(false);

            blockScopedLifecycle(() =>
            {
                inner = new LinkedReferenceCounter();
                expect(inner.getIsDestroyed()).toBe(false);
            });

            expect(inner.getIsDestroyed()).toBe(true);
        });

        expect(outer.getIsDestroyed()).toBe(true);
    });

    describe("=> error handling", () =>
    {
        afterEach(() => delete _BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH);

        it("bubbles exceptions and pops the stack with WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH off", () =>
        {
            expect(() =>
            {
                blockScopedLifecycle(() =>
                {
                    expect(lifecycleStack.getSize()).toBe(1);
                    throw new Error();
                });
            }).toThrow();

            expect(lifecycleStack.getSize()).toBe(0);
        });

        it("bubbles exceptions without modifying the stack with WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH on", () =>
        {
            _BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH = true;

            expect(() =>
            {
                blockScopedLifecycle(() =>
                {
                    expect(lifecycleStack.getSize()).toBe(1);
                    throw new Error();
                });
            }).toThrow();

            expect(lifecycleStack.getSize()).toBe(1);
            lifecycleStack.pop();
            _BUILD.WASM_DISABLE_STACK_LIFECYCLE_TRY_CATCH = false;
        });
    });
});
