import { Test_setDefaultFlags } from "../../test-util/test_set-default-flags.js";
import { LifecycleStack } from "./lifecycle-stack.js";
import { ReferenceCountedOwner } from "../../lifecycle/reference-counted-owner.js";
import { Test_resetLifeCycle } from "../../test-util/test_reset-life-cycle.js";

describe("=> LifecycleStack", () =>
{
    beforeEach(() =>
    {
        Test_setDefaultFlags();
        Test_resetLifeCycle();
    });

    it("| returns consistently from push and pop", () =>
    {
        const stack = new LifecycleStack();

        const first = stack.push();
        const second = stack.push();

        expect(second).not.toBe(first);
        expect(stack.pop()).toBe(second);
        expect(stack.pop()).toBe(first);
        expect(() => stack.pop()).toThrow();
    });

    it("| throws if there is no stack", () =>
    {
        const stack = new LifecycleStack();
        expect(() => stack.register(new ReferenceCountedOwner())).toThrow();
    });

    it("| adds the ref if the stack is populated", () =>
    {
        const stack = new LifecycleStack();
        const ref = new ReferenceCountedOwner(false);
        const top = stack.push();
        expect(top.length).toBe(0);
        stack.register(ref);
        expect(top.length).toBe(1);
        stack.pop();
    });
});