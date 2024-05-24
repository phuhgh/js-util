import { blockScopedLifecycle } from "./block-scoped-lifecycle.js";
import { lifecycleStack } from "../web-assembly/emscripten/lifecycle-stack.js";
import { ReferenceCountedOwner } from "./reference-counted-owner.js";
import { ILinkedReferences } from "./linked-references.js";
import { Test_setDefaultFlags } from "../test-util/test_set-default-flags.js";
import { Test_resetLifeCycle } from "../test-util/test_reset-life-cycle.js";
import { BlockScopedLifecycle } from "./block-scoped-lifecycle-owner.js";

describe("=> blockScopedLifecycle", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
        Test_resetLifeCycle();
    });

    describe("=> RAII version", () =>
    {
        it("| behaves like the functional version", () =>
        {
            let ptr!: ReferenceCountedOwner;
            (() =>
            {
                using _owner = new BlockScopedLifecycle();
                ptr = new ReferenceCountedOwner();
                expect(ptr.getIsDestroyed()).toBe(false);
            })();
            expect(ptr.getIsDestroyed()).toBe(true);
        });

        it("| handles exceptions", () =>
        {
            let ptr!: ReferenceCountedOwner;
            const error = new Error("oh noes, potatoes!");
            expect(() =>
                {
                    using _owner = new BlockScopedLifecycle();
                    ptr = new ReferenceCountedOwner();
                    expect(ptr.getIsDestroyed()).toBe(false);
                    throw error;
                }
            ).toThrow(error);

            expect(ptr.getIsDestroyed()).toBe(true);
        });
    });

    it("| releases on callback return", () =>
    {
        let ptr!: ReferenceCountedOwner;

        blockScopedLifecycle(() =>
        {
            ptr = new ReferenceCountedOwner();
            expect(ptr.getIsDestroyed()).toBe(false);
        });

        expect(ptr.getIsDestroyed()).toBe(true);
    });

    it("| handles nested calls", () =>
    {
        let outer!: ReferenceCountedOwner;

        blockScopedLifecycle(() =>
        {
            let inner!: ReferenceCountedOwner;
            outer = new ReferenceCountedOwner();
            expect(outer.getIsDestroyed()).toBe(false);

            blockScopedLifecycle(() =>
            {
                inner = new ReferenceCountedOwner();
                expect(inner.getIsDestroyed()).toBe(false);
            });

            expect(inner.getIsDestroyed()).toBe(true);
        });

        expect(outer.getIsDestroyed()).toBe(true);
    });

    it("| handles manual claim calls", () =>
    {
        let owner!: ReferenceCountedOwner;
        let child!: ReferenceCountedOwner;
        const thirdParty = new ReferenceCountedOwner(false);

        blockScopedLifecycle(() =>
        {
            [owner, child] = testFactory(thirdParty.getLinkedReferences());
            expect(owner.getIsDestroyed()).toBe(false);
            expect(child.getIsDestroyed()).toBe(false);
        });

        expect(owner.getIsDestroyed()).toBe(false);
        expect(child.getIsDestroyed()).toBe(false);
        thirdParty.release();
        expect(owner.getIsDestroyed()).toBe(true);
        expect(child.getIsDestroyed()).toBe(true);
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

function testFactory(bindToReference: ILinkedReferences)
{
    const owner = new ReferenceCountedOwner();
    const someComponent = new ReferenceCountedOwner();
    owner.getLinkedReferences().linkRef(someComponent);
    bindToReference.linkRef(owner);
    return [owner, someComponent] as const;
}