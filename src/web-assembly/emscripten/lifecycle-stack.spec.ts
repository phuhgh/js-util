import { setDefaultUnitTestFlags } from "../../test-util/set-default-unit-test-flags.js";
import { allocationStack, LifecycleStack } from "./lifecycle-stack.js";
import { LinkedReferenceCounter } from "../../lifecycle/linked-reference-counter.js";

describe("=> LifecycleStack", () =>
{
    beforeEach(() =>
    {
        setDefaultUnitTestFlags();
        allocationStack.length = 0;
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

    it("| does nothing if there is no stack", () =>
    {
        const stack = new LifecycleStack();
        stack.register(new LinkedReferenceCounter());
    });

    it("| adds the ref if the stack is populated", () =>
    {
        const stack = new LifecycleStack();
        const ref = new LinkedReferenceCounter();
        const top = stack.push();
        expect(top.length).toBe(0);
        stack.register(ref);
        expect(top.length).toBe(1);
        stack.pop();
    });
});